import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// --- КОНФИГУРАЦИЯ ---
export const bonusCampaignsTable = pgTable('bonus_campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // "Welcome Bonus 2024", "Twitter Drop #55"
  bonusType: varchar('bonus_type', { length: 20 }).notNull(), // 'CASH', 'FREE_SPINS', 'DEPOSIT_MATCH'
  config: jsonb('config').notNull(), // { "amount_usd": 10 } OR { "game_slug": "...", "spin_count": 20 }
  wagerMultiplier: integer('wager_multiplier').notNull().default(40),
  requirements: jsonb('requirements'), // { "min_vip_level": 1, "kyc_level_required": "level_1" }
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
});
