import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mnemonicToSeed } from 'bip39';
import { TronWeb } from 'tronweb';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, and, sql } from 'drizzle-orm';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { depositAddressesTable } from 'src/drizzle/schema/deposit-addresses.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { paymentsTable } from 'src/drizzle/schema/payments.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';

const bip32 = BIP32Factory(ecc);
const TRON_DERIVATION_PATH_ROOT = "m/44'/195'/0'/0";

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly masterSeed: string;

  constructor(
    private readonly config: ConfigService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject('TRON_WEB') private readonly tronWeb: TronWeb,
  ) {
    this.masterSeed = this.config.get<string>('CASINO_MNEMONIC', '');
    if (!this.masterSeed) throw new Error('MASTER MNEMONIC is missing!');
  }

  // ... (Ваш метод generateDepositAddress оставляем без изменений) ...
  async generateDepositAddress(
    userId: string,
    currencySymbol: string = 'USDT',
    network: string = 'TRC20',
  ) {
    // ... код генерации адреса (как в предыдущем ответе) ...
    // Для краткости я его свернул, но он должен быть здесь
    const currency = await this.db.query.currenciesTable.findFirst({
      where: and(
        eq(currenciesTable.symbol, currencySymbol),
        eq(currenciesTable.network, network),
      ),
    });
    if (!currency) throw new Error('Currency not found');

    const existing = await this.db.query.depositAddressesTable.findFirst({
      where: and(
        eq(depositAddressesTable.userId, userId),
        eq(depositAddressesTable.currencyId, currency.id),
      ),
    });
    if (existing) return existing.address;

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(depositAddressesTable);
    const nextIndex = Number(countResult[0].count);

    const addressData = await this.deriveAddress(nextIndex);

    await this.db.insert(depositAddressesTable).values({
      userId,
      currencyId: currency.id,
      address: addressData.address,
      derivationPath: addressData.path,
      isAssigned: true,
    });
    return addressData.address;
  }

  private async deriveAddress(index: number) {
    const seed = await mnemonicToSeed(this.masterSeed);
    const root = bip32.fromSeed(seed);
    const path = `${TRON_DERIVATION_PATH_ROOT}/${index}`;
    const child = root.derivePath(path);
    if (!child.privateKey) throw new Error('No private key');
    const privateKeyHex = Buffer.from(child.privateKey).toString('hex');
    const address = this.tronWeb.address.fromPrivateKey(privateKeyHex);
    if (!address) throw new Error('Invalid address');
    const addressString =
      typeof address === 'string' ? address : (address as any).base58;
    return { address: addressString, path };
  }

  /**
   * ✅ ДОБАВЛЕН МЕТОД: Обработка входящего депозита
   * Вызывается сканером блокчейна
   */
  async processDepositWebhook(dto: {
    txHash: string;
    amount: string;
    toAddress: string;
    fromAddress: string;
    confirmations: number;
  }) {
    const { txHash, amount, toAddress } = dto;
    const amountNum = Number(amount);

    return await this.db.transaction(async (tx) => {
      // 1. Проверяем, был ли уже такой депозит
      const existing = await tx.query.paymentsTable.findFirst({
        where: and(
          eq(paymentsTable.txHash, txHash),
          eq(paymentsTable.type, 'deposit'),
        ),
      });
      if (existing) return;

      // 2. Ищем, чей это адрес
      const addressRecord = await tx.query.depositAddressesTable.findFirst({
        where: eq(depositAddressesTable.address, toAddress),
      });
      if (!addressRecord) {
        this.logger.warn(`Deposit to unknown address: ${toAddress}`);
        return;
      }

      const userId = addressRecord.userId;
      if (!userId) {
        return new UnauthorizedException('user not auth');
      }

      // 3. Блокируем кошелек пользователя (создаем если нет)
      const wallet = await tx.query.walletsTable.findFirst({
        where: and(
          eq(walletsTable.userId, userId),
          eq(walletsTable.currencyId, addressRecord.currencyId),
        ),
        with: { currency: true },
      });

      let walletId = wallet?.id;
      let currentBalance = Number(wallet?.realBalance || 0);
      let version = wallet?.version || 0;
      let priceUsd = Number(wallet?.currency?.priceUsd || 1);

      if (!wallet) {
        const [newW] = await tx
          .insert(walletsTable)
          .values({
            userId,
            currencyId: addressRecord.currencyId,
            realBalance: '0',
          })
          .returning();

        walletId = newW.id;

        // Подтягиваем цену отдельно, если кошелька не было
        const cur = await tx.query.currenciesTable.findFirst({
          where: and(
            eq(currenciesTable.id, addressRecord.currencyId),
            eq(currenciesTable.network, 'TRC20'),
          ),
        });
        priceUsd = Number(cur?.priceUsd || 1);
      }

      if (!walletId) {
        return new UnauthorizedException('walletId not auth');
      }

      console.log(addressRecord, 'addressRecord');
      const currency = await tx.query.currenciesTable.findFirst({
        where: and(
          eq(currenciesTable.id, addressRecord.currencyId),
          eq(currenciesTable.network, 'TRC20'),
        ),
      });

      if (!currency) {
        this.logger.warn(`Currency is not TRC20 for wallet ${walletId}`);
        return;
      }

      // 4. Обновляем баланс
      await tx
        .update(walletsTable)
        .set({
          realBalance: (currentBalance + amountNum).toString(),
          version: version + 1,
        })
        .where(
          and(
            eq(walletsTable.id, walletId),
            eq(walletsTable.currencyId, currency.id),
          ),
        );

      // 5. Записываем платеж
      const [payment] = await tx
        .insert(paymentsTable)
        .values({
          userId,
          walletId,
          type: 'deposit',
          status: 'completed',
          amount: amount,
          amountUsdSnapshot: (amountNum * priceUsd).toString(),
          txHash,
          toAddress,
          depositAddressId: addressRecord.id,
          confirmations: dto.confirmations,
        })
        .returning();

      // 6. Записываем в Ledger
      await tx.insert(ledgerTable).values({
        walletId,
        referenceType: 'payment',
        referenceId: payment.id,
        type: 'deposit',
        amount: amount,
        balanceBefore: currentBalance.toString(),
        balanceAfter: (currentBalance + amountNum).toString(),
        description: `Deposit TRC20 ${txHash}`,
      });

      this.logger.log(`Success deposit: ${amount} to User ${userId}`);
    });
  }

  async createWithdrawalRequest(
    userId: string,
    walletId: string,
    amount: string,
    toAddress: string,
  ) {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    return await this.db.transaction(async (tx) => {
      // 1. Блокируем кошелек пользователя для безопасного обновления
      const wallet = await tx.query.walletsTable.findFirst({
        where: and(
          eq(walletsTable.id, walletId),
          eq(walletsTable.userId, userId), // Убеждаемся, что кошелек принадлежит юзеру
        ),
        with: { currency: true },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      const balance = parseFloat(wallet.realBalance);
      const minWithdrawal = parseFloat(wallet.currency.minWithdrawal || '0');
      const fee = parseFloat(wallet.currency.withdrawalFee || '0');
      const totalToDebit = amountNum + fee;

      // 2. Проверки
      if (balance < totalToDebit) {
        throw new BadRequestException('Insufficient funds (including fee)');
      }
      if (amountNum < minWithdrawal) {
        throw new BadRequestException(
          `Minimum withdrawal is ${minWithdrawal} ${wallet.currency.symbol}`,
        );
      }

      // 3. Блокируем средства: вычитаем из realBalance и прибавляем к lockedBalance
      await tx
        .update(walletsTable)
        .set({
          realBalance: (balance - totalToDebit).toString(),
          lockedBalance: sql`${walletsTable.lockedBalance} + ${totalToDebit}`,
          version: sql`${walletsTable.version} + 1`,
        })
        .where(eq(walletsTable.id, wallet.id));

      // 4. Создаем запись о платеже со статусом 'pending_approval'
      const [payment] = await tx
        .insert(paymentsTable)
        .values({
          userId,
          walletId,
          type: 'withdrawal',
          status: 'pending_approval',
          amount: amount,
          fee: fee.toString(),
          toAddress: toAddress,
          amountUsdSnapshot: (
            amountNum * parseFloat(wallet.currency.priceUsd || '1')
          ).toString(),
        })
        .returning();

      // 5. Записываем в Ledger (опционально, но рекомендуется для аудита)
      await tx.insert(ledgerTable).values({
        walletId,
        referenceType: 'payment',
        referenceId: payment.id,
        type: 'withdrawal',
        amount: `-${totalToDebit}`, // Отрицательная сумма
        balanceBefore: balance.toString(),
        balanceAfter: (balance - totalToDebit).toString(),
        description: `Withdrawal request to ${toAddress}`,
      });

      return payment;
    });
  }
}
