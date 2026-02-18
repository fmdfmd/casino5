import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TronWeb } from 'tronweb';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { WalletService } from './wallet.service';

import { eq } from 'drizzle-orm';
import { appSettingsTable } from 'src/drizzle/schema/app-settings.schema';
import { TRON_WEB } from 'src/tron/tron.provider';

// Контракт USDT (Mainnet). Для тестов заменим его ниже.
const USDT_CONTRACT_ADDRESS = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
// const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

@Injectable()
export class CryptoScannerService {
  private readonly logger = new Logger(CryptoScannerService.name);
  private isScanning = false; // Защита от наложения запусков cron

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly walletService: WalletService,
    @Inject(TRON_WEB) private readonly tronWeb: TronWeb,
  ) {}

  @Cron('*/10 * * * * *') // Запускаем чаще (раз в 10 сек), чтобы не копилась очередь
  async scanUsdtDeposits() {
    if (this.isScanning) return; // Если прошлый скан еще не закончился, пропускаем
    this.isScanning = true;

    this.logger.log('🔄 Start scanning USDT deposits...');

    try {
      // 1. Получаем время последнего сканирования из БД
      let lastScanTime = await this.getLastScanTimestamp();

      // Если запускаем первый раз в жизни, берем время 10 минут назад
      if (!lastScanTime) {
        lastScanTime = Date.now() - 10 * 60 * 1000;
      }

      // 2. Получаем адреса наших пользователей (для фильтрации)
      const myAddresses = await this.db.query.depositAddressesTable.findMany({
        columns: { address: true },
      });
      const addressSet = new Set(myAddresses.map((a) => a.address));

      if (addressSet.size === 0) {
        this.isScanning = false;
        return;
      }

      // 3. Запрашиваем события у TronGrid
      // Ипользуем min_timestamp, чтобы получить только НОВЫЕ события
      const options: any = {
        eventName: 'Transfer',
        onlyConfirmed: true,
        limit: 200, // Берем побольше за раз
        min_timestamp: lastScanTime, // <--- ГЛАВНОЕ ИСПРАВЛЕНИЕ
        order_by: 'timestamp,asc', // Сортируем от старых к новым, чтобы не потерять порядок
      };

      const eventsResult = await this.tronWeb.getEventResult(
        USDT_CONTRACT_ADDRESS,
        options,
      );

      const events = Array.isArray(eventsResult)
        ? eventsResult
        : (eventsResult as any).data || [];

      if (!Array.isArray(events)) {
        this.logger.error('Unexpected TronGrid response format', eventsResult);
        this.isScanning = false;
        return;
      }

      if (events.length === 0) {
        // Если событий нет, НИЧЕГО НЕ ДЕЛАЕМ.
        // Не обновляйте время на Date.now(), иначе пропустите транзакции,
        // которые произошли секунду назад, но еще не попали в TronGrid.
        this.isScanning = false;
        return;
      }

      if (events.length === 0) {
        // Если событий нет, обновляем время на "сейчас", чтобы в след раз не искать в далеком прошлом
        await this.updateLastScanTimestamp(Date.now());
        this.isScanning = false;
        return;
      }

      let maxTimestampInBatch = lastScanTime;

      for (const event of events) {
        // Обновляем курсор времени
        if (event.block_timestamp > maxTimestampInBatch) {
          maxTimestampInBatch = event.block_timestamp;
        }

        const toAddress = this.tronWeb.address.fromHex(event.result.to);
        const fromAddress = this.tronWeb.address.fromHex(event.result.from);

        // TronGrid может вернуть событие, которое равно min_timestamp, пропускаем дубли
        if (event.block_timestamp <= lastScanTime && events.length > 1)
          continue;

        const rawAmount = event.result.value;
        if (!rawAmount) continue;

        const amount = (parseInt(rawAmount) / 1_000_000).toString();
        const txHash = event.transaction_id;

        // 4. Если получатель НАШ - начисляем
        if (addressSet.has(toAddress)) {
          this.logger.log(
            `💰 Deposit Detected! ${amount} USDT -> ${toAddress}`,
          );

          await this.walletService.processDepositWebhook({
            txHash: txHash,
            amount: amount,
            toAddress: toAddress,
            fromAddress: fromAddress,
            confirmations: 1,
          });
        }
      }

      // 5. Сохраняем время последнего обработанного события + 1мс
      // Чтобы в следующий раз начать строго ПОСЛЕ него
      await this.updateLastScanTimestamp(maxTimestampInBatch + 1);
    } catch (error) {
      this.logger.error('Error scanning Tron:', error);
    } finally {
      this.isScanning = false;
    }
  }

  // --- Helpers для БД ---

  private async getLastScanTimestamp(): Promise<number | null> {
    const res = await this.db.query.appSettingsTable.findFirst({
      where: eq(appSettingsTable.key, 'last_usdt_scan_timestamp'),
    });
    return res ? Number(res.value) : null;
  }

  private async updateLastScanTimestamp(timestamp: number) {
    await this.db
      .insert(appSettingsTable)
      .values({ key: 'last_usdt_scan_timestamp', value: timestamp })
      .onConflictDoUpdate({
        target: appSettingsTable.key,
        set: { value: timestamp },
      });
  }
}
