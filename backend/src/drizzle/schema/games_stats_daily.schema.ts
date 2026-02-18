import { date, integer, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { gamesTable } from './games.schema';

export const gamesStatsDailyTable = pgTable(
  'games_stats_daily',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'cascade' }),

    date: date('date').notNull(),

    launches: integer('launches').notNull().default(0),
    demoLaunches: integer('demo_launches').notNull().default(0),
    realLaunches: integer('real_launches').notNull().default(0),

    uniquePlayers: integer('unique_players').notNull().default(0),
    realBets: integer('real_bets').notNull().default(0),
  },
  (table) => ({
    gameDateUnique: uniqueIndex('games_stats_daily_game_date_idx').on(
      table.gameId,
      table.date,
    ),
  }),
);
