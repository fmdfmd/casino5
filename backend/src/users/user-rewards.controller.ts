import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { users } from 'src/drizzle/schema/users.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';

// src/user/user-rewards.controller.ts
@Controller('rewards')
export class UserRewardsController {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /**
   * 🎁 ЗАБРАТЬ РЕЙКБЕК И БОНУСЫ
   * Переводит деньги с rakebackBalanceUsd на реальный кошелек USDT
   */
  @Post('claim-rakeback')
  @UseGuards(AccessTokenGuard)
  async claimRakeback(@Req() req) {
    const userId = req.user.sub;

    return await this.db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) {
        throw new UnauthorizedException('user not found');
      }
      const amountToClaim = Number(user.rakebackBalanceUsd);

      if (amountToClaim <= 0) throw new BadRequestException('Nothing to claim');

      // 1. Обнуляем баланс наград
      await tx
        .update(users)
        .set({ rakebackBalanceUsd: '0' })
        .where(eq(users.id, userId));

      // 2. Ищем основной кошелек (например USDT)
      // В продакшене лучше дать юзеру выбрать, куда зачислить, или конвертировать в валюту по умолчанию
      const currency = await tx.query.currenciesTable.findFirst({
        where: eq(currenciesTable.symbol, 'USDT'),
      });

      if (!currency) {
        throw new UnauthorizedException('currency not found');
      }
      const wallet = await tx.query.walletsTable.findFirst({
        where: and(
          eq(walletsTable.userId, userId),
          eq(walletsTable.currencyId, currency.id),
        ),
      });

      if (!wallet) {
        throw new UnauthorizedException('wallet not found');
      }

      // 3. Зачисляем средства
      await tx
        .update(walletsTable)
        .set({
          realBalance: sql`${walletsTable.realBalance} + ${amountToClaim}`,
        })
        .where(eq(walletsTable.id, wallet.id));

      //     const currentBalance = Number(wallet.realBalance);
      //    const balanceBefore = currentBalance;
      //     const balanceAfter = balanceBefore - betAmount + winAmount;

      //   // 4. Лог
      //   await tx.insert(ledgerTable).values({
      //     walletId: wallet.id,
      //     type: 'bonus',
      //     amount: amountToClaim.toString(),
      //     description: 'Rakeback Claim',
      //     balanceAfter:,
      //     balanceBefore:,
      //     referenceId:user.id ,

      //   });

      return { success: true, claimed: amountToClaim };
    });
  }
}
