import {
  numeric,
  text,
  timestamp,
  uniqueIndex,
  unique,
  uuid,
  integer,
  check,
} from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { currenciesTable } from './currencies.schema';
import { relations, sql } from 'drizzle-orm';
import { users } from './users.schema';

export const walletsTable = pgTable(
  'wallets',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    currencyId: uuid('currency_id')
      .notNull()
      .references(() => currenciesTable.id),

    // --- 1. Real Balance ---
    // Доступные средства. Можно ставить, можно выводить.
    realBalance: numeric('real_balance', { precision: 36, scale: 18 })
      .notNull()
      .default('0'),

    // --- 2. Bonus Balance ---
    // Средства с вейджером. Нельзя вывести, пока wager != 0.
    bonusBalance: numeric('bonus_balance', { precision: 36, scale: 18 })
      .notNull()
      .default('0'),

    // 3. Заблокированные средства (активные ставки или pending вывод)
    // Деньги ЗДЕСЬ физически существуют, но недоступны пользователю.
    lockedBalance: numeric('locked_balance', { precision: 36, scale: 18 })
      .notNull()
      .default('0'),

    wagerRemaining: numeric('wager_remaining', { precision: 36, scale: 18 })
      .notNull()
      .default('0'),

    // Для блокировок (Optimistic Locking)
    version: integer('version').default(0).notNull(),
  },
  (t) => [
    // Constraint: Баланс не может быть отрицательным (защита на уровне БД)
    uniqueIndex().on(t.userId, t.currencyId),
    check('wallets_balance_real_chk', sql`${t.realBalance} >= 0`),
    check('wallets_balance_bonus_chk', sql`${t.bonusBalance} >= 0`),
    check('wallets_balance_locked_chk', sql`${t.lockedBalance} >= 0`),
  ],
);

export const walletsRelations = relations(walletsTable, ({ one }) => ({
  user: one(users, { fields: [walletsTable.userId], references: [users.id] }),
  currency: one(currenciesTable, {
    fields: [walletsTable.currencyId],
    references: [currenciesTable.id],
  }),
}));
