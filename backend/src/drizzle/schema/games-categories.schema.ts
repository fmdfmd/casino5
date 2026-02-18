import { text } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const gamesCategoriesTable = pgTable('game_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
});
