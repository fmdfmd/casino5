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
  Patch,
  Put,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, desc, sql, and } from 'drizzle-orm';
import { paymentsTable } from 'src/drizzle/schema/payments.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { AdminGateway } from './admin.gateway'; // Ваш WebSocket Gateway
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { gamesTable } from 'src/drizzle/schema/games.schema';
import { gamesPopularityTable } from 'src/drizzle/schema/games-popularity.schema';
import { AdminService } from './admin.service';

@Controller('admin/finance')
@UseGuards(AccessTokenGuard)
export class AdminFinanceController {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly adminGateway: AdminGateway,
    private readonly adminService: AdminService,
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

  @Get()
  async getAllGamesAdmin() {
    return await this.db
      .select({
        id: gamesTable.id,
        name: gamesTable.name,
        isActive: gamesTable.isActive,
        popularityScore: gamesPopularityTable.popularityScore,
      })
      .from(gamesTable)
      .leftJoin(
        gamesPopularityTable,
        eq(gamesTable.id, gamesPopularityTable.gameId),
      );
  }

  @Patch(':id/status')
  async toggleGameStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    await this.db
      .update(gamesTable)
      .set({ isActive })
      .where(eq(gamesTable.id, id));
    return { success: true };
  }

  @Patch(':id/popularity')
  async boostPopularity(
    @Param('id') id: string,
    @Body('boostAmount') boostAmount: number,
  ) {
    // Устанавливаем или добавляем огромный буст (например +10000), чтобы игра стала топ-1
    await this.db
      .insert(gamesPopularityTable)
      .values({ gameId: id, popularityScore: boostAmount })
      .onConflictDoUpdate({
        target: gamesPopularityTable.gameId,
        set: { popularityScore: boostAmount }, // Перезаписываем скор
      });
    return { success: true };
  }
}
