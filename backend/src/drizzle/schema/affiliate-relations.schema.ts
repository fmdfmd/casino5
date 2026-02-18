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
import { affiliateCodesTable } from './affiliate-codes.schema';

export const affiliateRelationsTable = pgTable('affiliate_relations', {
  refereeId: uuid('referee_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }), // Приглашенный
  referrerId: uuid('referrer_id')
    .notNull()
    .references(() => users.id), // Пригласивший
  codeUsed: varchar('code_used', { length: 20 })
    .notNull()
    .references(() => affiliateCodesTable.code),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
