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

// --- КОНФИГУРАЦИЯ ---
export const affiliateCodesTable = pgTable('affiliate_codes', {
  code: varchar('code', { length: 20 }).primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Сколько % от своей комиссии владелец кода отдает другу в виде мгновенного кэшбэка
  friendCommissionShareRate: numeric('friend_commission_share_rate', {
    precision: 5,
    scale: 2,
  }).default('0.00'), // 0% to 50%

  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
