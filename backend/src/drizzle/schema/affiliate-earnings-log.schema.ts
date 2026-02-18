import {
  pgTable,
  uuid,
  numeric,
  timestamp,
  index,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { gameBetsTable } from './game-bets.schema';

export const affiliateEarningsLogTable = pgTable('affiliate_earnings_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceGameBetId: uuid('source_game_bet_id')
    .notNull()
    .references(() => gameBetsTable.id)
    .unique(),

  // Кто и с кого заработал
  referrerId: uuid('referrer_id')
    .notNull()
    .references(() => users.id),
  refereeId: uuid('referee_id')
    .notNull()
    .references(() => users.id),

  // Финансовый расчет
  refereeWagerUsd: numeric('referee_wager_usd', {
    precision: 18,
    scale: 2,
  }).notNull(),
  gameHouseEdge: numeric('game_house_edge', {
    precision: 5,
    scale: 2,
  }).notNull(),
  baseCommissionUsd: numeric('base_commission_usd', {
    precision: 18,
    scale: 4,
  }).notNull(),
  friendCashbackUsd: numeric('friend_cashback_usd', {
    precision: 18,
    scale: 4,
  }).notNull(),
  referrerCommissionUsd: numeric('referrer_commission_usd', {
    precision: 18,
    scale: 4,
  }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
