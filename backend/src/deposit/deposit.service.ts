import { Inject, Injectable, Logger } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { depositAddressesTable } from 'src/drizzle/schema/deposit-addresses.schema';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { eq, sql, and } from 'drizzle-orm';
import Big from 'big.js';

// DTO для входящих данных от блокчейн-сканера
export interface IncomingTxDto {
  txHash: string;
  amount: string; // "0.005"
  currency: string; // "BTC"
  network: string; // "Bitcoin"
  address: string; // На какой адрес пришли деньги
  confirmations: number;
}

@Injectable()
export class DepositService {
  // private readonly logger = new Logger(DepositService.name);
  // constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  // async processIncomingTransaction(data: IncomingTxDto) {
  //   const { txHash, amount, currency, network, address, confirmations } = data;
  //   // 1. Ищем, кому принадлежит адрес
  //   const depositAddr = await this.db.query.depositAddressesTable.findFirst({
  //     where: eq(depositAddressesTable.address, address),
  //   });
  //   if (!depositAddr) {
  //     this.logger.warn(`Deposit to unknown address: ${address}, tx: ${txHash}`);
  //     return; // Деньги пришли на наш кошелек, но мы не знаем юзера (возможно, старый адрес)
  //   }
  //   const userId = depositAddr.userId;
  //   if (!userId) return null;
  //   // 2. Получаем настройки валюты (мин. подтверждения)
  //   const currencyInfo = await this.db.query.currenciesTable.findFirst({
  //     where: and(
  //       eq(currenciesTable.symbol, currency),
  //       eq(currenciesTable.network, network),
  //     ),
  //   });
  //   if (!currencyInfo) throw new Error('Currency config not found');
  //   const requiredConf = currencyInfo.minConfirmations || 1;
  //   // const minDeposit = currencyInfo.minDeposit || '0';
  //   // ^ Тут можно добавить проверку на минимальный депозит
  //   // 3. Проверяем статус транзакции в нашей БД
  //   const existingTx = await this.db.query.transactions.findFirst({
  //     where: eq(transactions.txHash, txHash),
  //   });
  //   if (existingTx) {
  //     // 3.A. Если уже выполнена — выходим
  //     if (existingTx.status === 'confirmed') return;
  //     // 3.B. Если количество подтверждений обновилось
  //     if (existingTx.confirmations !== confirmations) {
  //       await this.db
  //         .update(transactions)
  //         .set({ confirmations })
  //         .where(eq(transactions.id, existingTx.id));
  //     }
  //     // 3.C. Если подтверждений стало достаточно — зачисляем
  //     if (confirmations >= requiredConf && existingTx.status === 'pending') {
  //       await this.creditUserBalance(
  //         userId,
  //         existingTx.id,
  //         amount,
  //         currencyInfo.id,
  //       );
  //     }
  //     return;
  //   }
  //   // 4. Если транзакции нет в БД — создаем новую (Pending)
  //   // Сначала найдем ID кошелька
  //   const wallet = await this.db.query.walletsTable.findFirst({
  //     where: and(
  //       eq(walletsTable.userId, userId),
  //       eq(walletsTable.currencyId, currencyInfo.id),
  //     ),
  //   });
  //   if (!wallet) {
  //     this.logger.error(
  //       `Wallet not found for user ${userId} currency ${currency}`,
  //     );
  //     return;
  //   }
  //   const [newTx] = await this.db
  //     .insert(transactions)
  //     .values({
  //       userId,
  //       walletId: wallet.id,
  //       type: 'deposit',
  //       currency,
  //       network,
  //       amount,
  //       txHash,
  //       toAddress: address,
  //       confirmations,
  //       status: confirmations >= requiredConf ? 'confirmed' : 'pending', // Сразу confirmed, если Instant
  //     })
  //     .returning();
  //   // 5. Если сразу достаточно подтверждений — зачисляем
  //   if (confirmations >= requiredConf) {
  //     await this.creditUserBalance(userId, newTx.id, amount, currencyInfo.id);
  //   }
  // }
  // // --- Критическая секция: Зачисление средств ---
  // private async creditUserBalance(
  //   userId: string,
  //   txId: string,
  //   amountStr: string,
  //   currencyId: string,
  // ) {
  //   await this.db.transaction(async (tx) => {
  //     // 1. Блокировка транзакции для обновления (защита от гонки)
  //     // В Drizzle пока нет удобного SELECT FOR UPDATE, но транзакция Serializable/RepeatableRead поможет
  //     // Проверяем статус еще раз внутри транзакции
  //     const currentTx = await tx.query.transactions.findFirst({
  //       where: eq(transactions.id, txId),
  //     });
  //     if (currentTx?.status === 'confirmed') return; // Уже обработана
  //     // 2. Обновляем статус транзакции
  //     await tx
  //       .update(transactions)
  //       .set({ status: 'confirmed' })
  //       .where(eq(transactions.id, txId));
  //     // 3. Атомарно обновляем баланс кошелька
  //     // sql`${walletsTable.balance} + ${amountStr}` — это происходит на уровне PostgreSQL
  //     const [updatedWallet] = await tx
  //       .update(walletsTable)
  //       .set({
  //         balance: sql`${walletsTable.balance} + ${amountStr}`, // Safe Numeric addition
  //         // updatedAt: new Date() // если есть поле
  //       })
  //       .where(
  //         and(
  //           eq(walletsTable.userId, userId),
  //           eq(walletsTable.currencyId, currencyId),
  //         ),
  //       )
  //       .returning();
  //     // 4. Пишем в Ledger (Аудит)
  //     await tx.insert(ledgerTable).values({
  //       walletId: updatedWallet.id,
  //       transactionId: txId,
  //       delta: amountStr, // +сумма
  //       balanceAfter: updatedWallet.balance, // Текущий баланс после обновления
  //     });
  //     this.logger.log(
  //       `User ${userId} deposited ${amountStr}. New balance: ${updatedWallet.balance}`,
  //     );
  //   });
  // }
}
