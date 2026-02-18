import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { gameEventsModeEnum, gameEventsTypeEnum } from './enums.schema';
import { timestamp } from 'drizzle-orm/pg-core';

export const gamesEventsTable = pgTable('game_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id').notNull(),
  userId: uuid('user_id').notNull(),
  type: gameEventsTypeEnum('type').notNull(),
  mode: gameEventsModeEnum('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
