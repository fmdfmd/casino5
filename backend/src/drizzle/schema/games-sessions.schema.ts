import {
  pgTable,
  uuid,
  varchar,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { gamesTable } from './games.schema';
import { gameSessionStatusEnum } from './enums.schema';

export const gameSessionsTable = pgTable('game_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => gamesTable.id),

  serverSeedHash: varchar('server_seed_hash', { length: 128 }).notNull(),
  serverSeed: varchar('server_seed', { length: 128 }), // Revealed after completion
  clientSeed: varchar('client_seed', { length: 64 }),
  nonce: varchar('nonce', { length: 64 }).notNull(), // Can be a large number or string

  result: jsonb('result'), // e.g., { "multiplier": 15.32 } or { "cards": [...] }
  status: gameSessionStatusEnum('status').default('created').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});
