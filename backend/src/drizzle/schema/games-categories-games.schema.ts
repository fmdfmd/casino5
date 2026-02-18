import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { gamesTable } from './games.schema';
import { gamesCategoriesTable } from './games-categories.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const gamesCategoriesGamesTable = pgTable('games_categories_games', {
  gameId: uuid('game_id')
    .notNull()
    .references(() => gamesTable.id, { onDelete: 'cascade' }),

  gamesCategoriesId: uuid('games_categories_id')
    .notNull()
    .references(() => gamesCategoriesTable.id, { onDelete: 'cascade' }),
});

export const gamesCategoriesGamesRelations = relations(
  gamesCategoriesGamesTable,
  ({ one }) => ({
    game: one(gamesTable, {
      fields: [gamesCategoriesGamesTable.gameId],
      references: [gamesTable.id],
    }),
    gamesCategories: one(gamesCategoriesTable, {
      fields: [gamesCategoriesGamesTable.gamesCategoriesId],
      references: [gamesCategoriesTable.id],
    }),
  }),
);

export type UserRolesType = InferSelectModel<typeof gamesCategoriesGamesTable>;
export type NewUserRolesType = InferInsertModel<
  typeof gamesCategoriesGamesTable
>;
