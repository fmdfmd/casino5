import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { walletsTable } from './wallets.schema';

export const balanceLocksTable = pgTable('balance_locks', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletId: uuid('wallet_id')
    .notNull()
    .references(() => walletsTable.id),

  amount: numeric('amount', { precision: 36, scale: 18 }).notNull(),
  reason: varchar('reason', { length: 50 }).notNull(), // 'withdrawal_request', 'active_bet'
  referenceId: uuid('reference_id').notNull(), // PaymentID or SessionID

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
