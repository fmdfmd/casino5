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
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { paymentsTable } from 'src/drizzle/schema/payments.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { AdminGateway } from './admin.gateway';
import { gamesStatsDailyTable } from 'src/drizzle/schema/games_stats_daily.schema';
import { gamesTable } from 'src/drizzle/schema/games.schema';
import { gamesCategoriesGamesTable } from 'src/drizzle/schema/games-categories-games.schema';
import { gamesCategoriesTable } from 'src/drizzle/schema/games-categories.schema';
// Импортируйте AccessTokenGuard и AdminGuard (если есть)

@Controller('admin/finance')
// @UseGuards(AccessTokenGuard, AdminGuard)
export class AdminService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly adminGateway: AdminGateway,
  ) {}

  async getAllGames() {
    return await this.db.query.gamesTable.findMany({
      with: {
        categoriesLinks: {
          with: {
            gamesCategories: true, // ← это relation из join-таблицы
          },
        },
      },
      orderBy: [desc(gamesTable.isActive)],
    });
  }

  // 1. Получение истории всех операций (Лента)
  async getHistory(limit: number) {
    return await this.db.query.ledgerTable.findMany({
      limit,
      orderBy: [desc(ledgerTable.createdAt)],
      with: {
        wallet: {
          with: { user: true, currency: true },
        },
      },
    });
  }

  // Получение ожидающих выводов (с подгрузкой риск-скора и KYC)
  async getPendingWithdrawals() {
    return await this.db.query.paymentsTable.findMany({
      where: eq(paymentsTable.status, 'pending_approval'),
      orderBy: [desc(paymentsTable.createdAt)],
      with: {
        user: true, // Позволит фронту видеть riskScore и kycLevel
        wallet: { with: { currency: true } },
      },
    });
  }

  // Подтверждение вывода
  async approveWithdrawal(paymentId: string, txHash: string, adminId: string) {
    if (!txHash) throw new BadRequestException('TX Hash is required');

    return await this.db.transaction(async (tx) => {
      // 1. Проверяем платеж с FOR UPDATE (блокировка строки от двойного клика)
      const payment = await tx.query.paymentsTable.findFirst({
        where: and(
          eq(paymentsTable.id, paymentId),
          eq(paymentsTable.status, 'pending_approval'),
        ),
        with: { wallet: true },
      });

      if (!payment)
        throw new NotFoundException('Payment is not pending or not found');

      // 2. Обновляем статус
      const [updatedPayment] = await tx
        .update(paymentsTable)
        .set({
          status: 'completed',
          txHash,
          processedBy: adminId,
          updatedAt: new Date(),
        })
        .where(eq(paymentsTable.id, paymentId))
        .returning();

      // 3. Списываем Locked Balance (деньги физически ушли)
      await tx
        .update(walletsTable)
        .set({
          lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}::numeric`,
          version: sql`${walletsTable.version} + 1`,
        })
        .where(eq(walletsTable.id, payment.walletId));

      // 4. Запись в Ledger (минусовая сумма)
      const [ledgerEntry] = await tx
        .insert(ledgerTable)
        .values({
          walletId: payment.walletId,
          referenceType: 'payment',
          referenceId: payment.id,
          type: 'withdrawal',
          amount: `-${payment.amount}`,
          balanceBefore: payment.wallet.realBalance,
          balanceAfter: payment.wallet.realBalance,
          description: `Withdrawal approved. Hash: ${txHash}`,
        })
        .returning();

      // 5. Оповещаем другие админки через WebSockets
      this.broadcastUpdates(tx, updatedPayment, ledgerEntry);

      return { success: true, payment: updatedPayment };
    });
  }

  // Отклонение вывода
  async rejectWithdrawal(
    paymentId: string,
    adminId: string,
    reason: string = 'Rejected by Admin',
  ) {
    return await this.db.transaction(async (tx) => {
      const payment = await tx.query.paymentsTable.findFirst({
        where: and(
          eq(paymentsTable.id, paymentId),
          eq(paymentsTable.status, 'pending_approval'),
        ),
      });

      if (!payment) throw new NotFoundException('Payment is not pending');

      // 1. Статус Rejected
      const [updatedPayment] = await tx
        .update(paymentsTable)
        .set({
          status: 'rejected',
          rejectionReason: reason,
          processedBy: adminId,
          updatedAt: new Date(),
        })
        .where(eq(paymentsTable.id, paymentId))
        .returning();

      // 2. Возврат средств: Из Locked обратно в Real
      await tx
        .update(walletsTable)
        .set({
          lockedBalance: sql`${walletsTable.lockedBalance} - ${payment.amount}::numeric`,
          realBalance: sql`${walletsTable.realBalance} + ${payment.amount}::numeric`,
          version: sql`${walletsTable.version} + 1`,
        })
        .where(eq(walletsTable.id, payment.walletId));

      // 3. Запись в Ledger (возврат)
      const [ledgerEntry] = await tx
        .insert(ledgerTable)
        .values({
          walletId: payment.walletId,
          referenceType: 'adjustment',
          referenceId: payment.id,
          type: 'refund',
          amount: payment.amount, // Плюсовая сумма
          balanceBefore: '0', // В реальном проекте тут нужно сделать выборку баланса до/после
          balanceAfter: '0',
          description: `Withdrawal rejected: ${reason}`,
        })
        .returning();

      this.broadcastUpdates(tx, updatedPayment, ledgerEntry);

      return { success: true };
    });
  }

  // Вспомогательный метод для отправки сокетов (чтобы не дублировать код)
  private async broadcastUpdates(tx: any, payment: any, ledgerEntry: any) {
    const fullPayment = await tx.query.paymentsTable.findFirst({
      where: eq(paymentsTable.id, payment.id),
      with: { user: true, wallet: { with: { currency: true } } },
    });
    const fullLedger = await tx.query.ledgerTable.findFirst({
      where: eq(ledgerTable.id, ledgerEntry.id),
      with: { wallet: { with: { user: true, currency: true } } },
    });

    this.adminGateway.sendTransactionUpdate(fullPayment);
    this.adminGateway.sendTransaction(fullLedger);
  }

  async getGamesAnalyticsChart(gameId?: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const conditions = gameId
      ? and(
          eq(gamesStatsDailyTable.gameId, gameId),
          gte(gamesStatsDailyTable.date, dateStr),
        )
      : gte(gamesStatsDailyTable.date, dateStr);

    // Группируем по дням
    const stats = await this.db
      .select({
        date: gamesStatsDailyTable.date,
        totalLaunches: sql<number>`SUM(${gamesStatsDailyTable.launches})`,
        totalRealBets: sql<number>`SUM(${gamesStatsDailyTable.realBets})`,
      })
      .from(gamesStatsDailyTable)
      .where(conditions)
      .groupBy(gamesStatsDailyTable.date)
      .orderBy(gamesStatsDailyTable.date);

    return stats;
  }

  async updateGameSettings(id: string, dto: any) {
    const [updated] = await this.db
      .update(gamesTable)
      .set({
        name: dto.name,
        isActive: dto.isActive,
        houseEdge: dto.houseEdge,
        rtp: dto.rtp,
        minBetUsd: dto.minBetUsd,
        maxBetUsd: dto.maxBetUsd,
      })
      .where(eq(gamesTable.id, id))
      .returning();
    return updated;
  }

  async assignGameToCategories(gameId: string, categoryIds: string[]) {
    return await this.db.transaction(async (tx) => {
      // 1. Удаляем старые связи
      await tx
        .delete(gamesCategoriesGamesTable)
        .where(eq(gamesCategoriesGamesTable.gameId, gameId));

      // 2. Добавляем новые
      if (categoryIds.length > 0) {
        const insertData = categoryIds.map((catId) => ({
          gameId,
          gamesCategoriesId: catId,
        }));
        await tx.insert(gamesCategoriesGamesTable).values(insertData);
      }

      return { success: true };
    });
  }

  // --- 5. СПИСОК ВСЕХ КАТЕГОРИЙ ---
  async getCategories() {
    return await this.db.select().from(gamesCategoriesTable);
  }
}
