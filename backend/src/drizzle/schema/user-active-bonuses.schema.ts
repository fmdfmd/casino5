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
import { users } from './users.schema';
import { bonusCampaignsTable } from './bonus-campaigns.schema';

export const userActiveBonusesTable = pgTable('user_active_bonuses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id)
    .unique(), // У пользователя может быть только 1 активный бонус
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => bonusCampaignsTable.id),
  initialWagerRequirementUsd: numeric('initial_wager_requirement_usd', {
    precision: 20,
    scale: 2,
  }).notNull(),
  wagerRequirementRemainingUsd: numeric('wager_requirement_remaining_usd', {
    precision: 20,
    scale: 2,
  }).notNull(),
  status: varchar('status', { length: 10 }).default('active').notNull(), // 'active', 'completed', 'expired'
  expiresAt: timestamp('expires_at'),
  activatedAt: timestamp('activated_at').defaultNow().notNull(),
});
