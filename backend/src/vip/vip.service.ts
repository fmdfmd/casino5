import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, sql, and, gte, desc, asc } from 'drizzle-orm';
import { users } from 'src/drizzle/schema/users.schema';
import { vipConfigTable } from 'src/drizzle/schema/vip-config.schema';
import { vipRewardsLogTable } from 'src/drizzle/schema/vip-rewards-log.schema';

@Injectable()
export class VipService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /**
   * 💎 Обработка прогресса VIP (Внутри транзакции ставки)
   */
  async processVipProgress(
    tx: any,
    userId: string,
    betUsd: number,
    gameHouseEdge: number,
  ) {
    // 1. Начисляем Wager (общий оборот)
    // SQL returning используется, чтобы сразу получить обновленные данные
    const [updatedUser] = await tx
      .update(users)
      .set({ totalWageredUsd: sql`${users.totalWageredUsd} + ${betUsd}` })
      .where(eq(users.id, userId))
      .returning();

    // 2. Начисляем Рейкбек (Rakeback)
    // Стандарт Stake: ~5-10% от House Edge возвращается игроку на баланс "Claim"
    // Мы берем ставку рейкбека из конфига текущего уровня юзера
    const currentVipConfig = await this.getVipConfig(tx, updatedUser.vipLevel);
    const rakebackRate = Number(currentVipConfig?.rakebackRate || 5); // Default 5%

    const rakebackAmount =
      betUsd * (gameHouseEdge / 100) * (rakebackRate / 100);

    if (rakebackAmount > 0) {
      await tx
        .update(users)
        .set({
          rakebackBalanceUsd: sql`${users.rakebackBalanceUsd} + ${rakebackAmount}`,
        })
        .where(eq(users.id, userId));
    }

    // 3. Проверка повышения уровня (Level Up)
    await this.checkLevelUp(tx, updatedUser);
  }

  private async checkLevelUp(tx: any, user: any) {
    // Ищем следующий уровень, до которого дорос пользователь
    const nextLevel = await tx.query.vipConfigTable.findFirst({
      where: and(
        gte(vipConfigTable.wagerRequiredUsd, user.totalWageredUsd),
        sql`${vipConfigTable.level} > ${user.vipLevel}`,
      ),
      orderBy: [desc(vipConfigTable.level)], // Берем самый высокий доступный
    });

    // ВНИМАНИЕ: Логика выше упрощена. Обычно ищут "самый высокий уровень, где wagerRequired <= userWager".
    // Правильнее:
    const correctLevelConfig = await tx.query.vipConfigTable.findFirst({
      where: sql`${vipConfigTable.wagerRequiredUsd} <= ${user.totalWageredUsd}`,
      orderBy: [desc(vipConfigTable.level)],
    });

    if (correctLevelConfig && correctLevelConfig.level > user.vipLevel) {
      // Уровень повысился!
      await tx
        .update(users)
        .set({ vipLevel: correctLevelConfig.level })
        .where(eq(users.id, user.id));

      // Выдаем бонус за уровень (Level Up Bonus)
      const bonusAmount = Number(correctLevelConfig.levelUpBonusUsd);
      if (bonusAmount > 0) {
        // Можно начислить сразу на баланс или в отдельное поле "bonus_to_claim"
        // Для простоты начислим в Rakeback баланс, чтобы юзер забрал кнопку Claim
        await tx
          .update(users)
          .set({
            rakebackBalanceUsd: sql`${users.rakebackBalanceUsd} + ${bonusAmount}`,
          })
          .where(eq(users.id, user.id));

        await tx.insert(vipRewardsLogTable).values({
          userId: user.id,
          rewardType: 'level_up',
          amountUsd: bonusAmount.toString(),
          sourceData: {
            oldLevel: user.vipLevel,
            newLevel: correctLevelConfig.level,
          },
        });
      }
    }
  }

  async getVipPageData(userId: string | null) {
    // 1. Получаем все уровни
    const levels = await this.db.query.vipConfigTable.findMany({
      orderBy: [asc(vipConfigTable.level)],
    });

    let currentUserData: any = null;

    // 2. Если юзер авторизован, получаем его стату
    if (userId) {
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (user) {
        // Находим следующий уровень
        const nextLevel = levels.find(
          (l) => Number(l.wagerRequiredUsd) > Number(user.totalWageredUsd),
        );
        const maxLevelWager = levels[levels.length - 1].wagerRequiredUsd;

        currentUserData = {
          currentWager: Number(user.totalWageredUsd),
          currentLevel: user.vipLevel,
          nextLevelName: nextLevel ? nextLevel.name : 'Max Level',
          nextLevelWager: nextLevel
            ? Number(nextLevel.wagerRequiredUsd)
            : Number(maxLevelWager),
        };
      }
    }
    return {
      levels,
      userProgress: currentUserData || {
        currentWager: 0,
        currentLevel: 0,
        nextLevelName: levels[0]?.name || 'Guest',
        nextLevelWager: Number(levels[0]?.wagerRequiredUsd || 100),
      },
    };
  }
  private async getVipConfig(tx: any, level: number) {
    // В реальном проекте это нужно кешировать в Redis
    return await tx.query.vipConfigTable.findFirst({
      where: eq(vipConfigTable.level, level),
    });
  }
}
