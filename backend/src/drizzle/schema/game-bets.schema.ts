import {
  pgTable,
  uuid,
  varchar,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { walletsTable } from './wallets.schema';
import { currenciesTable } from './currencies.schema';
import { gamesTable } from './games.schema';
import { gameSessionsTable } from './games-sessions.schema';

export const gameBetsTable = pgTable(
  'game_bets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => walletsTable.id),
    currencyId: uuid('currency_id')
      .notNull()
      .references(() => currenciesTable.id),

    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id),
    sessionId: varchar('session_id', { length: 255 }).notNull(),

    betAmount: numeric('bet_amount', { precision: 36, scale: 18 }).notNull(),
    payoutMultiplier: numeric('payout_multiplier', { precision: 12, scale: 4 }),
    winAmount: numeric('win_amount', { precision: 36, scale: 18 })
      .default('0')
      .notNull(),

    // USD value for analytics & rakeback
    betAmountUsd: numeric('bet_amount_usd', {
      precision: 18,
      scale: 2,
    }).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    sessionIdx: index('idx_bets_session').on(t.sessionId),
    userGameIdx: index('idx_bets_user_game').on(t.userId, t.gameId),
  }),
);

export const gameBetsRelations = relations(gameBetsTable, ({ one }) => ({
  user: one(users, { fields: [gameBetsTable.userId], references: [users.id] }),
  session: one(gameSessionsTable, {
    fields: [gameBetsTable.sessionId],
    references: [gameSessionsTable.id],
  }),
  game: one(gamesTable, {
    fields: [gameBetsTable.gameId],
    references: [gamesTable.id],
  }),
}));
