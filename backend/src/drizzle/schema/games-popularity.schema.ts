import { pgTable, uuid, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { gamesTable } from './games.schema';

export const gamesPopularityTable = pgTable(
  'games_popularity',
  {
    gameId: uuid('game_id')
      .primaryKey()
      .references(() => gamesTable.id, { onDelete: 'cascade' }),

    launches24h: integer('launches_24h').notNull().default(0),
    launches7d: integer('launches_7d').notNull().default(0),
    launches30d: integer('launches_30d').notNull().default(0),
    totalLaunches: integer('total_launches').notNull().default(0),

    realBetsCount: integer('real_bets_count').notNull().default(0),
    demoBetsCount: integer('demo_bets_count').notNull().default(0),

    uniquePlayers7d: integer('unique_players_7d').notNull().default(0),

    lastPlayedAt: timestamp('last_played_at', {
      withTimezone: true,
    }),

    popularityScore: integer('popularity_score').notNull().default(0),
  },
  (table) => ({
    popularityIdx: index('games_popularity_score_idx').on(
      table.popularityScore,
    ),
    lastPlayedIdx: index('games_popularity_last_played_idx').on(
      table.lastPlayedAt,
    ),
  }),
);
