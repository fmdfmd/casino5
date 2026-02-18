import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, desc, sql } from 'drizzle-orm';
import { paymentsTable } from 'src/drizzle/schema/payments.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
// Импортируйте AccessTokenGuard и AdminGuard (если есть)

@Controller('admin/finance')
// @UseGuards(AccessTokenGuard, AdminGuard) // Важно! Защитите этот роут
export class AdminService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // 1. Получение истории всех операций (Лента)
  @Get('history')
  async getHistory(@Query('limit') limit = 50) {
    return await this.db.query.ledgerTable.findMany({
      limit: Number(limit),
      orderBy: [desc(ledgerTable.createdAt)],
      with: {
        wallet: {
          with: {
            user: true, // Чтобы видеть email/username
            currency: true, // Символ валюты
          },
        },
      },
    });
  }

  // 2. Получение ожидающих выводов
  @Get('withdrawals/pending')
  async getPendingWithdrawals() {
    return await this.db.query.paymentsTable.findMany({
      where: eq(paymentsTable.status, 'pending_approval'),
      orderBy: [desc(paymentsTable.createdAt)],
      with: {
        user: true,
        wallet: { with: { currency: true } },
      },
    });
  }

  // 3. Подтверждение вывода (Ручное)
  @Post('withdrawals/:id/approve')
  async approveWithdrawal(
    @Param('id') id: string,
    @Body('txHash') txHash: string, // Админ вводит хеш транзакции, которую он отправил
  ) {
    if (!txHash) throw new BadRequestException('Transaction Hash is required');

    return await this.db.transaction(async (tx) => {
      const payment = await tx.query.paymentsTable.findFirst({
        where: eq(paymentsTable.id, id),
      });

      if (!payment || payment.status !== 'pending_approval') {
        throw new BadRequestException('Payment not pending');
      }

      // Обновляем статус платежа
      await tx
        .update(paymentsTable)
        .set({
          status: 'completed',
          txHash: txHash,
          updatedAt: new Date(),
        })
        .where(eq(paymentsTable.id, id));

      // Списываем заблокированные средства (lockedBalance -> 0 для этой суммы)
      // Логика зависит от того, как вы блокировали средства при создании заявки.
      // Обычно: realBalance уменьшается сразу, lockedBalance увеличивается.
      // При успехе: lockedBalance уменьшается.

      await tx
        .update(walletsTable)
        .set({
          lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}`,
        })
        .where(eq(walletsTable.id, payment.walletId));

      return { success: true };
    });
  }

  // 4. Отклонение вывода
  @Post('withdrawals/:id/reject')
  async rejectWithdrawal(@Param('id') id: string) {
    // Логика возврата средств:
    // status -> rejected
    // lockedBalance -> realBalance (возврат денег юзеру)
    // ...
    return { success: true };
  }
}
