import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { gamesCategoriesGamesTable } from './games-categories-games.schema';

export const gamesCategoriesTable = pgTable('game_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
});

export const gamesCategoriesRelations = relations(
  gamesCategoriesTable,
  ({ many }) => ({
    gamesLinks: many(gamesCategoriesGamesTable),
  }),
);
