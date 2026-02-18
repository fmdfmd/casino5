// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   UseGuards,
//   Query,
//   BadRequestException,
//   Inject,
// } from '@nestjs/common';
// import { DRIZZLE } from 'src/drizzle/drizzle.module';
// import type { DrizzleDB } from 'src/drizzle/types/drizzle';
// import { eq, desc, sql } from 'drizzle-orm';
// import { paymentsTable } from 'src/drizzle/schema/payments.schema';
// import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
// import { walletsTable } from 'src/drizzle/schema/wallets.schema';
// import { AdminGateway } from './admin.gateway';
// // Импортируйте AccessTokenGuard и AdminGuard (если есть)

// @Controller('admin/finance')
// // @UseGuards(AccessTokenGuard, AdminGuard) // Важно! Защитите этот роут
// export class AdminFinanceController {
//   constructor(
//     @Inject(DRIZZLE) private readonly db: DrizzleDB,
//     private readonly adminGateway: AdminGateway,
//   ) {}

//   // 1. Получение истории всех операций (Лента)
//   @Get('history')
//   async getHistory(@Query('limit') limit = 50) {
//     return await this.db.query.ledgerTable.findMany({
//       limit: Number(limit),
//       orderBy: [desc(ledgerTable.createdAt)],
//       with: {
//         wallet: {
//           with: {
//             user: true, // Чтобы видеть email/username
//             currency: true, // Символ валюты
//           },
//         },
//       },
//     });
//   }

//   // 2. Получение ожидающих выводов
//   @Get('withdrawals/pending')
//   async getPendingWithdrawals() {
//     return await this.db.query.paymentsTable.findMany({
//       where: eq(paymentsTable.status, 'pending_approval'),
//       orderBy: [desc(paymentsTable.createdAt)],
//       with: {
//         user: true,
//         wallet: { with: { currency: true } },
//       },
//     });
//   }

//     @Post('withdrawals/:id/approve')
//   async approveWithdrawal(
//     @Param('id') id: string,
//     @Body('txHash') txHash: string,
//   ) {
//     if (!txHash) throw new BadRequestException('Transaction Hash is required');

//     return await this.db.transaction(async (tx) => {
//       // 1. Получаем платеж
//       const payment = await tx.query.paymentsTable.findFirst({
//         where: eq(paymentsTable.id, id),
//       });

//       if (!payment || payment.status !== 'pending_approval') {
//         throw new BadRequestException('Payment not valid');
//       }

//       // 2. Обновляем статус платежа
//       await tx
//         .update(paymentsTable)
//         .set({
//           status: 'completed',
//           txHash: txHash,
//           updatedAt: new Date(),
//         })
//         .where(eq(paymentsTable.id, id));

//       // 3. Снимаем блокировку средств (lockedBalance)
//       await tx
//         .update(walletsTable)
//         .set({
//           lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}`,
//         })
//         .where(eq(walletsTable.id, payment.walletId));

//       // 4. Создаем запись в Ledger (Истории), чтобы она появилась во вкладке History
//       const [ledgerEntry] = await tx.insert(ledgerTable).values({
//         walletId: payment.walletId,
//         type: 'withdrawal',
//         amount: -payment.amount, // Отрицательное число для вывода
//         description: `Manual withdrawal: ${txHash}`,
//         referenceId: payment.id,

//       }).returning();

//       // 5. Отправляем сокеты
//       // Обновляем заявку (чтобы она исчезла из Pending)
//       const updatedPayment = { ...payment, status: 'completed', txHash };
//       this.adminGateway.sendTransactionUpdate(updatedPayment);

//       // Добавляем запись в ленту истории (чтобы появилась в History)
//       // Нужно подтянуть данные пользователя для красивого отображения в ленте
//       const fullLedgerEntry = await tx.query.ledgerTable.findFirst({
//          where: eq(ledgerTable.id, ledgerEntry.id),
//          with: { wallet: { with: { user: true, currency: true } } }
//       });

//       if(fullLedgerEntry) {
//           this.adminGateway.sendTransaction(fullLedgerEntry);
//       }

//       return { success: true };
//     });
//   }

//   // 4. Отклонение
//   @Post('withdrawals/:id/reject')
//   async rejectWithdrawal(@Param('id') id: string) {
//     return await this.db.transaction(async (tx) => {
//       const payment = await tx.query.paymentsTable.findFirst({
//         where: eq(paymentsTable.id, id),
//       });

//       if (!payment || payment.status !== 'pending_approval') {
//         throw new BadRequestException('Invalid payment');
//       }

//       // Возвращаем статус
//       await tx.update(paymentsTable)
//         .set({ status: 'rejected', updatedAt: new Date() })
//         .where(eq(paymentsTable.id, id));

//       // Возвращаем деньги на баланс (locked -> balance)
//       // Логика: locked уменьшаем, balance увеличиваем (возврат)
//       // *Примечание: Зависит от того, вычли ли вы balance при создании заявки.
//       // Обычно: при создании balance -= amount, locked += amount.
//       // При отмене: locked -= amount, balance += amount.

//       await tx.update(walletsTable)
//         .set({
//            lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}`,
//            balance: sql`${walletsTable.balance} + ${payment.amount}`
//         })
//         .where(eq(walletsTable.id, payment.walletId));

//       // Отправляем сокет об обновлении (чтобы исчезло из Pending)
//       this.adminGateway.sendTransactionUpdate({ ...payment, status: 'rejected' });

//       return { success: true };
//     });
//   }
// }

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
  NotFoundException,
  Req,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, desc, sql, and } from 'drizzle-orm';
import { paymentsTable } from 'src/drizzle/schema/payments.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { AdminGateway } from './admin.gateway'; // Ваш WebSocket Gateway
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';

@Controller('admin/finance')
@UseGuards(AccessTokenGuard)
export class AdminFinanceController {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly adminGateway: AdminGateway,
  ) {}

  // --- 1. Лента истории (Все подтвержденные операции) ---
  @Get('history')
  async getHistory(@Query('limit') limit = 100) {
    // Берем данные из Ledger (фактические движения средств)
    return await this.db.query.ledgerTable.findMany({
      limit: Number(limit),
      orderBy: [desc(ledgerTable.createdAt)],
      with: {
        wallet: {
          with: {
            user: true, // username, email
            currency: true, // symbol, network
          },
        },
      },
    });
  }

  // --- 2. Ожидающие выводы ---
  @Get('withdrawals/pending')
  async getPendingWithdrawals() {
    // Берем из Payments, где статус pending_approval
    return await this.db.query.paymentsTable.findMany({
      where: eq(paymentsTable.status, 'pending_approval'),
      orderBy: [desc(paymentsTable.createdAt)],
      with: {
        user: true,
        wallet: {
          with: {
            currency: true,
          },
        },
      },
    });
  }

  // --- 3. Подтверждение вывода (Approve) ---
  @Post('withdrawals/:id/approve')
  async approveWithdrawal(
    @Param('id') id: string,
    @Body('txHash') txHash: string,
    @Req() req,
  ) {
    if (!txHash) throw new BadRequestException('Transaction Hash is required');
    const userId = req.user.sub;
    return await this.db.transaction(async (tx) => {
      // 1. Ищем платеж с текущим статусом pending
      const payment = await tx.query.paymentsTable.findFirst({
        where: and(
          eq(paymentsTable.id, id),
          eq(paymentsTable.status, 'pending_approval'),
        ),
        with: { wallet: true },
      });

      if (!payment)
        throw new NotFoundException('Payment not found or not pending');

      // 2. Обновляем статус платежа
      await tx
        .update(paymentsTable)
        .set({
          status: 'completed',
          txHash: txHash,
          processedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(paymentsTable.id, id));

      // 3. Сжигаем Locked Balance
      // ВАЖНО: Добавляем ::numeric к параметру amount, чтобы Postgres понял, что это число
      await tx
        .update(walletsTable)
        .set({
          lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}::numeric`,
          version: sql`${walletsTable.version} + 1`,
        })
        .where(eq(walletsTable.id, payment.walletId));

      // 4. Записываем в Ledger
      // ИСПРАВЛЕНИЕ: Формируем строку с минусом в JS, а не в SQL
      const negativeAmount = `-${payment.amount}`;

      const [ledgerEntry] = await tx
        .insert(ledgerTable)
        .values({
          walletId: payment.walletId,
          referenceType: 'payment',
          referenceId: payment.id,
          type: 'withdrawal',
          amount: negativeAmount, // Передаем "-75.00" как строку, Drizzle и Postgres поймут
          balanceBefore: payment.wallet.realBalance,
          balanceAfter: payment.wallet.realBalance, // Баланс не меняется сейчас (он изменился при создании заявки)
          description: `Withdrawal completed. Hash: ${txHash}`,
        })
        .returning();

      // 5. Отправляем сокеты

      // А) Обновляем статус заявки (чтобы ушла из Pending)
      const updatedPayment = await tx.query.paymentsTable.findFirst({
        where: eq(paymentsTable.id, id),
        with: { user: true, wallet: { with: { currency: true } } },
      });
      // Если у вас есть метод update, используйте его, иначе просто отправьте объект
      if (this.adminGateway) {
        this.adminGateway.sendTransactionUpdate(updatedPayment);
      }

      // Б) Добавляем запись в ленту истории
      const fullLedger = await tx.query.ledgerTable.findFirst({
        where: eq(ledgerTable.id, ledgerEntry.id),
        with: { wallet: { with: { user: true, currency: true } } },
      });

      if (this.adminGateway) {
        this.adminGateway.sendTransaction(fullLedger);
      }

      return { success: true };
    });
  }

  // --- 4. Отклонение вывода (Reject) ---
  @Post('withdrawals/:id/reject')
  async rejectWithdrawal(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;
    return await this.db.transaction(async (tx) => {
      const payment = await tx.query.paymentsTable.findFirst({
        where: and(
          eq(paymentsTable.id, id),
          eq(paymentsTable.status, 'pending_approval'),
        ),
      });

      if (!payment)
        throw new NotFoundException('Payment not found or not pending');

      // 1. Обновляем статус
      await tx
        .update(paymentsTable)
        .set({
          status: 'rejected',
          rejectionReason: 'Rejected by admin',
          processedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(paymentsTable.id, id));

      // 2. Возврат средств (Refund)
      // Locked уменьшаем, Real увеличиваем обратно
      await tx
        .update(walletsTable)
        .set({
          lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}`,
          realBalance: sql`${walletsTable.realBalance} + ${payment.amount}`,
          version: sql`${walletsTable.version} + 1`,
        })
        .where(eq(walletsTable.id, payment.walletId));

      // 3. (Опционально) Ledger запись о возврате
      // Можно не писать, если мы считаем, что транзакции не было,
      // но для аудита лучше записать type: 'refund' или 'adjustment'

      // 4. Сокет
      const updatedPayment = await tx.query.paymentsTable.findFirst({
        where: eq(paymentsTable.id, id),
        with: { user: true, wallet: { with: { currency: true } } },
      });
      this.adminGateway.sendTransactionUpdate(updatedPayment);

      return { success: true };
    });
  }
}
