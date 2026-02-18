import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { TRON_WEB } from './tron.provider';
import { TronWeb } from 'tronweb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TronService {
  private readonly logger = new Logger(TronService.name);

  constructor(
    @Inject(TRON_WEB) private readonly tronWeb: TronWeb,
    private readonly configService: ConfigService,
  ) {}

  deriveTronAddress(index: number) {
    const mnemonic = this.configService.get<string>('CASINO_MNEMONIC');

    if (!mnemonic) {
      throw new Error('CASINO_MNEMONIC not found');
    }

    const bip32 = BIP32Factory(ecc);

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const root = bip32.fromSeed(seed);

    const path = `m/44'/195'/0'/0/${index}`;
    const child = root.derivePath(path);

    if (!child.privateKey) {
      throw new Error('Failed to derive private key');
    }

    const privateKeyBuffer = Buffer.from(child.privateKey);

    const privateKey = privateKeyBuffer!.toString('hex');

    const address = this.tronWeb.address.fromPrivateKey(privateKey);

    return {
      address,
      privateKey,
    };
  }

  async sweepToHotWallet(index: number, mainWallet: string) {
    const { address, privateKey } = this.deriveTronAddress(index);

    const tronWebInstance = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      privateKey,
    });

    // TRX sweep
    const balanceSun = await tronWebInstance.trx.getBalance(address);
    if (balanceSun > 1_000_000) {
      // минимальный threshold для газа
      const tx = await tronWebInstance.trx.sendTransaction(
        mainWallet,
        balanceSun - 1_000_000,
      );
      this.logger.log(`TRX sweep tx: ${tx.txid}`);
    }

    // TRC20 sweep (USDT пример)
    const contract = await tronWebInstance
      .contract()
      .at('TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7');
    const balance = await contract.balanceOf(address).call();
    if (balance > 0) {
      const tx = await contract
        .transfer(mainWallet, balance)
        .send({ feeLimit: 100_000_000 });
      this.logger.log(`USDT sweep tx: ${tx}`);
    }
  }

  /**
   * 1. ГЕНЕРАЦИЯ АДРЕСА
   * Мы не создаем кошельки хаотично. Мы используем HD Wallet.
   * index - это уникальный номер юзера (или номер кошелька), например 1, 2, 500.
   */
  // async generateAddress(
  //   index: number,
  // ): Promise<{ address: string; privateKey: string }> {
  //   // 1. Превращаем 12 слов в "Семя" (Seed) - длинный набор байт
  //   const seed = await bip39.mnemonicToSeed(this.mnemonic);

  //   // 2. Создаем "Корень" дерева кошельков
  //   const node = bip32.fromSeed(seed);

  //   // 3. Выводим дочерний ключ по пути Трона.
  //   // m / 44' (стандарт BIP44) / 195' (ID Трона) / 0' / 0 / index (номер нашего юзера)
  //   const child = node.derivePath(`m/44'/195'/0'/0/${index}`);

  //   // 4. Получаем приватный ключ этого конкретного дочернего кошелька
  //   const privateKey = child.privateKey.toString('hex');

  //   // 5. TronWeb делает из приватного ключа публичный адрес (начинается на T...)
  //   const address = this.tronWeb.address.fromPrivateKey(privateKey);

  //   return { address, privateKey };
  // }

  // /**
  //  * 2. ПРОВЕРКА ДЕПОЗИТОВ (Самое важное)
  //  * Метод проверяет последние транзакции конкретного адреса.
  //  * address - адрес кошелька пользователя, который мы сгенерировали выше.
  //  */
  // async checkTransactions(address: string) {
  //   try {
  //     // Мы используем API TronGrid, чтобы получить историю транзакций по токенам (TRC20)
  //     // GET запрос: "Дай мне историю TRC20 операций для этого адреса, только входящие"
  //     const url = `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?only_to=true&contract_address=${this.usdtContractAddress}`;

  //     const response = await axios.get(url, {
  //       headers: { 'TRON-PRO-API-KEY': this.tronGridApiKey },
  //     });

  //     // data - это массив найденных транзакций
  //     const transactions = response.data.data;

  //     // Пробегаемся по каждой найденной транзакции
  //     for (const tx of transactions) {
  //       // tx.value - сумма перевода. В блокчейне нет запятых.
  //       // USDT имеет 6 знаков после запятой.
  //       // Если пришло "1000000", это значит 1.00 USDT.
  //       const amount = parseFloat(tx.value) / 1_000_000;

  //       // tx.transaction_id - уникальный хеш транзакции.
  //       // ВАЖНО: Тебе нужно проверить в своей Базе Данных,
  //       // не зачислял ли ты этот transaction_id ранее?
  //       // Если нет - зачисляй и сохраняй ID в базу.

  //       this.logger.log(
  //         `Найдена транзакция! Сумма: ${amount} USDT, Hash: ${tx.transaction_id}`,
  //       );

  //       // Тут вызов функции: this.saveDepositToDb(userId, amount, tx.transaction_id);
  //     }
  //   } catch (error) {
  //     this.logger.error('Ошибка проверки транзакций', error.message);
  //   }
  // }

  async createWallet(): Promise<{
    address: string;
    privateKey: string;
    publicKey: string;
  }> {
    const account = await this.tronWeb.createAccount();
    this.logger.log(`New TRON wallet created: ${account.address.base58}`);

    return {
      address: account.address.base58,
      privateKey: account.privateKey,
      publicKey: account.publicKey,
    };
  }
}
