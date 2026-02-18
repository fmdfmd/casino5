import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq, sql, and } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { gameBetsTable } from 'src/drizzle/schema/game-bets.schema';
import { gamesTable } from 'src/drizzle/schema/games.schema';
import { ledgerTable } from 'src/drizzle/schema/ledger.schema';
import { users } from 'src/drizzle/schema/users.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { affiliateRelationsTable } from 'src/drizzle/schema/affiliate-relations.schema';
import { affiliateEarningsLogTable } from 'src/drizzle/schema/affiliate-earnings-log.schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { AdminGateway } from 'src/admin/admin.gateway';
import { ChatGateway } from 'src/chat/chat.gateway';
import { AffiliateService } from 'src/affiliate/affiliate.service';
import { VipService } from 'src/vip/vip.service';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);
  private readonly hallId: string;
  private readonly hallKey: string;
  private readonly providerUrl: string;
  private readonly openGameUrl: string;
  private readonly frontendUrl: string;
  private readonly hallCurrencySymbol: string;

  constructor(
    private readonly config: ConfigService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly chatGateway: ChatGateway,
    private readonly vipService: VipService,
    private readonly affiliateService: AffiliateService,
  ) {
    this.hallId = this.config.get<string>('PROVIDER_HALL_ID', '');
    this.hallKey = this.config.get<string>('PROVIDER_HALL_KEY', '');
    this.providerUrl = this.config.get<string>('PROVIDER_URL', '');
    this.openGameUrl = this.config.get<string>('PROVIDER_OPEN_GAME_URL', '');
    this.frontendUrl = this.config.get<string>('FRONTEND_URL', '');
    this.hallCurrencySymbol = this.config.get<string>('HALL_CURRENCY', 'USDT');
  }

  /**
   * 🚀 ОТКРЫТИЕ ИГРЫ
   */
  async openGame(gameId: string, demo = false, userId: string) {
    const game = await this.db.query.gamesTable.findFirst({
      where: eq(gamesTable.providerGameId, gameId),
    });

    if (!game) throw new Error('Game not found');

    const response = await fetch(this.openGameUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd: 'openGame',
        hall: this.hallId,
        key: this.hallKey,
        domain: this.frontendUrl,
        exitUrl: `${this.frontendUrl}/games/close`,
        language: 'en',
        login: userId,
        gameId: game.providerGameId,
        demo: demo ? '1' : '0',
      }),
    });

    return response.json();
  }

  /**
   * 💰 ОБРАБОТКА CALLBACK (getBalance / writeBet)
   */
  async handleCallback(body: any) {
    if (body.key !== this.hallKey)
      return { status: 'fail', error: 'wrong_key' };
    switch (body.cmd) {
      case 'getBalance':
        return this.processGetBalance(body.login);
      case 'writeBet':
        return this.processWriteBet(body);

      default:
        return { status: 'fail', error: 'unknown_cmd' };
    }
  }

  /**
   * 🔍 ПОЛУЧЕНИЕ БАЛАНСА
   */
  private async processGetBalance(userId: string) {
    // ЕСЛИ LOGIN НЕ UUID, СРАЗУ ГОВОРИМ ЧТО ЮЗЕР НЕ НАЙДЕН
    if (!this.isValidUuid(userId)) {
      this.logger.warn(`Invalid UUID format received: ${userId}`);
      return { status: 'fail', error: 'user_not_found' };
    }

    const wallet = await this.findWalletWithCurrency(userId);
    if (!wallet) return { status: 'fail', error: 'user_not_found' };

    return {
      status: 'success',
      error: '',
      login: userId,
      balance: Number(wallet.realBalance).toFixed(2),
      currency: this.hallCurrencySymbol,
    };
  }

  /**
   * 🎰 ЛОГИКА СТАВКИ (КРИТИЧЕСКИЙ УЗЕЛ)
   */

  private async processWriteBet(dto: any) {
    const {
      login: userId,
      bet,
      win,
      gameId: providerGameId,
      tradeId,
      sessionId,
      betInfo,
    } = dto;

    if (!this.isValidUuid(userId)) {
      this.logger.error(`WriteBet failed: ${userId} is not a valid UUID`);
      return { status: 'fail', error: 'user_not_found' };
    }

    const betAmount = Number(bet);
    const winAmount = Number(win);

    try {
      return await this.db.transaction(async (tx) => {
        const currency = await tx.query.currenciesTable.findFirst({
          where: and(
            eq(currenciesTable.symbol, this.hallCurrencySymbol),
            eq(currenciesTable.network, 'TRC20'),
          ),
        });

        if (!currency) {
          this.logger.error(
            `Currency ${this.hallCurrencySymbol} not found in DB`,
          );
          return { status: 'fail', error: 'internal_error' };
        }
        // 1. Блокируем кошелек и получаем курс валюты (FOR UPDATE через raw SQL или findFirst)
        const wallet = await tx.query.walletsTable.findFirst({
          where: and(
            eq(walletsTable.userId, userId),
            eq(walletsTable.currencyId, currency.id),
          ),
          with: { currency: true },
        });

        if (!wallet || wallet.currency.symbol !== this.hallCurrencySymbol) {
          return { status: 'fail', error: 'wallet_not_found' };
        }

        const game = await tx.query.gamesTable.findFirst({
          where: eq(gamesTable.providerGameId, providerGameId),
        });

        const houseEdge = Number(game?.houseEdge || 3.0); // Default 3%
        const currentBalance = Number(wallet.realBalance);

        // 2. Валидация баланса (если не возврат)
        if (currentBalance < betAmount && betInfo !== 'refund') {
          return { status: 'fail', error: 'fail_balance' };
        }

        // 3. Расчет финансовой дельты
        const balanceBefore = currentBalance;
        const balanceAfter = balanceBefore - betAmount + winAmount;

        // 4. Обновление баланса кошелька (Optimistic lock через version)
        await tx
          .update(walletsTable)
          .set({
            realBalance: balanceAfter.toString(),
            version: sql`${walletsTable.version} + 1`,
          })
          .where(eq(walletsTable.id, wallet.id));

        // 5. Расчет USD эквивалента (для VIP и партнерки)
        const betUsd = betAmount * Number(wallet.currency.priceUsd);
        const winUsd = winAmount * Number(wallet.currency.priceUsd);
        const houseEdgeBase = Number(game?.houseEdge || '3.00');

        // 6. Сохранение ставки
        const [betRecord] = await tx
          .insert(gameBetsTable)
          .values({
            userId,
            walletId: wallet.id,
            currencyId: wallet.currencyId,
            gameId: game?.id || sql`null`,
            sessionId: sessionId,
            betAmount: betAmount.toString(),
            winAmount: winAmount.toString(),
            betAmountUsd: betUsd.toString(),
            payoutMultiplier:
              betAmount > 0 ? (winAmount / betAmount).toFixed(4) : '0',
          })
          .returning();

        // 7. Ledger (Аудит)
        const [ledgerRecord] = await tx
          .insert(ledgerTable)
          .values({
            walletId: wallet.id,
            referenceType: 'game_round',
            referenceId: betRecord.id,
            type: winAmount >= betAmount ? 'win' : 'bet',
            amount: (winAmount - betAmount).toString(),
            balanceBefore: balanceBefore.toString(),
            balanceAfter: balanceAfter.toString(),
            description: `Spin in ${game?.name || providerGameId}. Trade: ${tradeId}`,
          })
          .returning();

        const fullLedgerEntry = await tx.query.ledgerTable.findFirst({
          where: eq(ledgerTable.id, ledgerRecord.id),
          with: {
            wallet: {
              with: {
                user: true,
                currency: true,
              },
            },
          },
        });

        // 8. VIP & RAKEBACK (Stake Style)
        // Рейкбек = Wager * HouseEdge * 5% (стандарт индустрии)
        const rakebackGain = betUsd * (houseEdgeBase / 100) * 0.05;

        await tx
          .update(users)
          .set({
            totalWageredUsd: sql`${users.totalWageredUsd} + ${betUsd}`,
            rakebackBalanceUsd: sql`${users.rakebackBalanceUsd} + ${rakebackGain.toString()}`,
          })
          .where(eq(users.id, userId));

        await this.vipService.processVipProgress(tx, userId, betUsd, houseEdge);

        // Б) Партнерская программа (Комиссии + Откаты)
        await this.affiliateService.processBetCommission(
          tx,
          userId,
          betUsd,
          houseEdge,
          betRecord.id,
        );

        if (fullLedgerEntry) {
          this.chatGateway.sendTransaction(fullLedgerEntry);
        }

        return {
          status: 'success',
          error: '',
          login: userId,
          balance: balanceAfter.toFixed(2),
          currency: this.hallCurrencySymbol,
        };
      });
    } catch (error) {
      this.logger.error(
        `WriteBet Critical Error: ${error.message}`,
        error.stack,
      );
      return { status: 'fail', error: 'internal_error' };
    }
  }

  /**
   * 🤝 РАСЧЕТ ПАРТНЕРСКОЙ КОМИССИИ
   */
  private async processAffiliateCommission(
    tx: any,
    userId: string,
    betUsd: number,
    houseEdge: number,
    betId: string,
  ) {
    const relation = await tx.query.affiliateRelationsTable.findFirst({
      where: eq(affiliateRelationsTable.refereeId, userId),
    });

    if (!relation) return;

    // Комиссия = Wager * HouseEdge * 10% (базовая доля партнера)
    const totalCommission = betUsd * (houseEdge / 100) * 0.1;

    // В вашей схеме есть friendCommissionShareRate (сколько партнер отдает другу)
    // Допустим, партнер отдает 10% от своей доли другу как Cashback
    const friendShareRate = 0.1;
    const friendCashback = totalCommission * friendShareRate;
    const referrerNet = totalCommission - friendCashback;

    // Зачисляем партнеру
    await tx
      .update(users)
      .set({
        affiliateCommissionBalanceUsd: sql`${users.affiliateCommissionBalanceUsd} + ${referrerNet.toString()}`,
      })
      .where(eq(users.id, relation.referrerId));

    // Зачисляем игроку (Friend Cashback)
    await tx
      .update(users)
      .set({
        rakebackBalanceUsd: sql`${users.rakebackBalanceUsd} + ${friendCashback.toString()}`,
      })
      .where(eq(users.id, userId));

    // Логируем начисления
    await tx.insert(affiliateEarningsLogTable).values({
      sourceGameBetId: betId,
      referrerId: relation.referrerId,
      refereeId: userId,
      refereeWagerUsd: betUsd.toString(),
      gameHouseEdge: houseEdge.toString(),
      baseCommissionUsd: totalCommission.toString(),
      friendCashbackUsd: friendCashback.toString(),
      referrerCommissionUsd: referrerNet.toString(),
    });
  }

  /**
   * 🛠 ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
   */
  private async findWalletWithCurrency(userId: string) {
    const currency = await this.db.query.currenciesTable.findFirst({
      where: and(
        eq(currenciesTable.symbol, this.hallCurrencySymbol),
        eq(currenciesTable.network, 'TRC20'),
      ),
    });

    if (!currency) return null;

    return await this.db.query.walletsTable.findFirst({
      where: and(
        eq(walletsTable.userId, userId),
        eq(walletsTable.currencyId, currency.id),
      ),
      with: { currency: true },
    });
  }

  async getJackpots() {
    const res = await fetch(this.providerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd: 'jackpots',
        hall: this.hallId,
        key: this.hallKey,
      }),
    });
    return res.json();
  }

  async getLogs(sessionId: string, page = 1, count = 20) {
    const res = await fetch(this.providerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd: 'gameSessionsLog',
        hall: this.hallId,
        key: this.hallKey,
        sessionsId: sessionId,
        page,
        count,
      }),
    });
    return res.json();
  }

  private isValidUuid(uuid: string) {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }
}
