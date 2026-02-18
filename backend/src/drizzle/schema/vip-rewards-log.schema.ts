import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  index,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const vipRewardsLogTable = pgTable('vip_rewards_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  rewardType: varchar('reward_type', { length: 20 }).notNull(), // 'level_up', 'rakeback', 'weekly_boost', 'monthly_bonus'
  amountUsd: numeric('amount_usd', { precision: 12, scale: 2 }).notNull(),
  sourceData: jsonb('source_data'), // { "wagered_last_7d": 5000, "pnl": -250, "vip_level": 4 }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
