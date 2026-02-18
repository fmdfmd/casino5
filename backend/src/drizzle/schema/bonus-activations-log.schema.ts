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
import { bonusCodesTable } from './bonus-codes.schema';
import { bonusCampaignsTable } from './bonus-campaigns.schema';

export const bonusActivationsLogTable = pgTable(
  'bonus_activations_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    codeUsed: varchar('code_used', { length: 30 }).references(
      () => bonusCodesTable.code,
    ),
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => bonusCampaignsTable.id),
    bonusGranted: jsonb('bonus_granted'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    userCampaignUniq: uniqueIndex('idx_bonus_user_campaign').on(
      t.userId,
      t.campaignId,
    ),
  }),
);
