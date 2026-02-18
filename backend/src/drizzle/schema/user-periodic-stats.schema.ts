import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  index,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const userPeriodicStatsTable = pgTable(
  'user_periodic_stats',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    wageredLast7dUsd: numeric('wagered_last_7d_usd', {
      precision: 20,
      scale: 2,
    })
      .default('0')
      .notNull(),
    pnlLast7dUsd: numeric('pnl_last_7d_usd', { precision: 20, scale: 2 })
      .default('0')
      .notNull(), // PNL казино (Bet - Win)
    wageredLast30dUsd: numeric('wagered_last_30d_usd', {
      precision: 20,
      scale: 2,
    })
      .default('0')
      .notNull(),
    pnlLast30dUsd: numeric('pnl_last_30d_usd', { precision: 20, scale: 2 })
      .default('0')
      .notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId] }),
  }),
);
