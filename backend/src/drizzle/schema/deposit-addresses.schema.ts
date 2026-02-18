import { currenciesTable } from './currencies.schema';
import { users } from './users.schema';
import {
  uuid,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';

export const depositAddressesTable = pgTable('deposit_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  currencyId: uuid('currency_id')
    .notNull()
    .references(() => currenciesTable.id),

  address: varchar('address', { length: 128 }).notNull(),
  derivationPath: varchar('derivation_path', { length: 255 }), //

  isAssigned: boolean('is_assigned').default(true),

  createdAt: timestamp('created_at').defaultNow(),
});
