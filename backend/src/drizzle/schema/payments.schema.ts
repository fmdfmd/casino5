import {
  pgTable,
  uuid,
  numeric,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { paymentsStatusEnum, transactionTypeEnum } from './enums.schema';
import { users } from './users.schema';
import { walletsTable } from './wallets.schema';
import { relations, sql } from 'drizzle-orm';

export const paymentsTable = pgTable(
  'paymentsTable',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => walletsTable.id),

    type: transactionTypeEnum('type').notNull(), // deposit, withdrawal
    status: paymentsStatusEnum('status').default('pending_approval').notNull(),

    // Деньги
    amount: numeric('amount', { precision: 36, scale: 18 }).notNull(),
    fee: numeric('fee', { precision: 36, scale: 18 }).default('0'), // Комиссия казино
    networkFee: numeric('network_fee', { precision: 36, scale: 18 }).default(
      '0',
    ), // Газ (для вывода)

    // Стоимость в USD на момент создания заявки (для отчетов)
    amountUsdSnapshot: numeric('amount_usd_snapshot', {
      precision: 18,
      scale: 2,
    }),

    // Crypto Details
    txHash: text('tx_hash'),
    fromAddress: text('from_address'),
    toAddress: text('to_address'), // Куда выводим
    depositAddressId: uuid('deposit_address_id'), // Ссылка на адрес депозита
    confirmations: integer('confirmations').default(0),

    // Admin / Audit
    processedBy: uuid('processed_by'), // Admin ID if manual
    rejectionReason: text('rejection_reason'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    // ЗАЩИТА ОТ ДВОЙНОГО ЗАЧИСЛЕНИЯ
    // Один хеш может быть обработан как депозит только один раз
    uniqueTx: uniqueIndex('uniq_payments_tx_hash_type')
      .on(t.txHash, t.type)
      .where(sql`${t.txHash} IS NOT NULL`),
  }),
);

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  user: one(users, {
    fields: [paymentsTable.userId],
    references: [users.id],
  }),
  wallet: one(walletsTable, {
    fields: [paymentsTable.walletId],
    references: [walletsTable.id],
  }),
}));
