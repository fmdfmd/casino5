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
import { bonusCampaignsTable } from './bonus-campaigns.schema';

export const bonusCodesTable = pgTable('bonus_codes', {
  code: varchar('code', { length: 30 }).primaryKey(),
  campaignId: uuid('campaign_id')
    .notNull()
    .references(() => bonusCampaignsTable.id, { onDelete: 'cascade' }),
  maxTotalUses: integer('max_total_uses'), // null = безлимит
  maxUsesPerUser: integer('max_uses_per_user').default(1),
  currentTotalUses: integer('current_total_uses').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});
