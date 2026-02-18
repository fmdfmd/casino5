import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import {
  ledgerRefType,
  messageTypeEnum,
  transactionTypeEnum,
} from './enums.schema';
import { walletsTable } from './wallets.schema';
import { relations } from 'drizzle-orm';

export const ledgerTable = pgTable('ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletId: uuid('wallet_id')
    .notNull()
    .references(() => walletsTable.id),

  // Полиморфная связь (откуда пришли деньги)
  referenceType: ledgerRefType('ref_type'),
  referenceId: uuid('reference_id').notNull(),

  type: transactionTypeEnum('type').notNull(),

  amount: numeric('amount').notNull(), // +Win или -Bet
  balanceBefore: numeric('balance_before').notNull(),
  balanceAfter: numeric('balance_after').notNull(),

  // Метаданные
  description: text('description'), // "Win in Gates of Olympus"
  createdAt: timestamp('created_at').defaultNow(),
});

export const ledgerRelations = relations(ledgerTable, ({ one }) => ({
  wallet: one(walletsTable, {
    fields: [ledgerTable.walletId],
    references: [walletsTable.id],
  }),
}));
