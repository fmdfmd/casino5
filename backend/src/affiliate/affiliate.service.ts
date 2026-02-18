import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, sql, and } from 'drizzle-orm';
import { affiliateCodesTable } from 'src/drizzle/schema/affiliate-codes.schema';
import { affiliateRelationsTable } from 'src/drizzle/schema/affiliate-relations.schema';
import { affiliateEarningsLogTable } from 'src/drizzle/schema/affiliate-earnings-log.schema';
import { users } from 'src/drizzle/schema/users.schema';

@Injectable()
export class AffiliateService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /**
   * 🔗 Создание реферального кода
   */
  async createCode(userId: string, code: string, friendShareRate: number = 0) {
    // friendShareRate (0.00 - 0.50) — сколько % своей прибыли отдаем другу
    if (friendShareRate < 0 || friendShareRate > 0.5)
      throw new BadRequestException('Invalid share rate');

    const exists = await this.db.query.affiliateCodesTable.findFirst({
      where: eq(affiliateCodesTable.code, code),
    });
    if (exists) throw new BadRequestException('Code already taken');

    await this.db.insert(affiliateCodesTable).values({
      ownerId: userId,
      code,
      friendCommissionShareRate: friendShareRate.toString(),
    });
    return { success: true, code };
  }

  /**
   * 🤝 Привязка пользователя к рефереру (обычно при регистрации)
   */
  async bindUserToCode(userId: string, code: string) {
    const affiliateCode = await this.db.query.affiliateCodesTable.findFirst({
      where: eq(affiliateCodesTable.code, code),
    });
    if (!affiliateCode || affiliateCode.ownerId === userId) return; // Нельзя пригласить самого себя

    // Проверяем, не привязан ли уже
    const existingRelation =
      await this.db.query.affiliateRelationsTable.findFirst({
        where: eq(affiliateRelationsTable.refereeId, userId),
      });
    if (existingRelation) return;

    await this.db.insert(affiliateRelationsTable).values({
      refereeId: userId,
      referrerId: affiliateCode.ownerId,
      codeUsed: code,
    });
  }

  /**
   * 💰 Расчет комиссии (Вызывается внутри транзакции ставки)
   * Логика Stake:
   * 1. Берем House Edge игры (например 3%).
   * 2. Берем ставку (например 100$). Теоретическая прибыль казино = 3$.
   * 3. Система отдает аффилиату 30% (SYSTEM_RATE) от теоретической прибыли. (0.9$).
   * 4. Если аффилиат настроил Kickback 10%, то 0.09$ идет игроку, 0.81$ аффилиату.
   */
  async processBetCommission(
    tx: any, // Транзакция Drizzle
    userId: string,
    betUsd: number,
    gameHouseEdge: number, // В процентах, например 3.0
    betId: string,
  ) {
    // 1. Ищем связь
    const relation = await tx.query.affiliateRelationsTable.findFirst({
      where: eq(affiliateRelationsTable.refereeId, userId),
    });
    if (!relation) return;

    // 2. Получаем настройки кода (чтобы узнать % отката другу)
    const codeInfo = await tx.query.affiliateCodesTable.findFirst({
      where: eq(affiliateCodesTable.code, relation.codeUsed),
    });
    const friendShareRate = Number(codeInfo?.friendCommissionShareRate || 0);

    // 3. Математика
    // SYSTEM_COMMISSION_RATE - глобальная настройка (сколько казино отдает партнерам). Обычно 10-40%.
    const SYSTEM_COMMISSION_RATE = 0.3;

    const theoreticalProfit = betUsd * (gameHouseEdge / 100);
    const totalCommission = theoreticalProfit * SYSTEM_COMMISSION_RATE;

    const friendAmount = totalCommission * friendShareRate; // Мгновенный рейкбек другу
    const referrerAmount = totalCommission - friendAmount; // Прибыль партнера

    // 4. Обновление балансов (atomic increment)
    if (referrerAmount > 0) {
      await tx
        .update(users)
        .set({
          affiliateCommissionBalanceUsd: sql`${users.affiliateCommissionBalanceUsd} + ${referrerAmount}`,
        })
        .where(eq(users.id, relation.referrerId));
    }

    if (friendAmount > 0) {
      await tx
        .update(users)
        .set({
          rakebackBalanceUsd: sql`${users.rakebackBalanceUsd} + ${friendAmount}`,
        })
        .where(eq(users.id, userId));
    }

    // 5. Логирование (для статистики в админке)
    await tx.insert(affiliateEarningsLogTable).values({
      sourceGameBetId: betId,
      referrerId: relation.referrerId,
      refereeId: userId,
      refereeWagerUsd: betUsd.toString(),
      gameHouseEdge: gameHouseEdge.toString(),
      baseCommissionUsd: totalCommission.toString(),
      friendCashbackUsd: friendAmount.toString(),
      referrerCommissionUsd: referrerAmount.toString(),
    });
  }
}
