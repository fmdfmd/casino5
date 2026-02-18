import { boolean, numeric, text } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Identification
  slug: text('slug').unique().notNull(), // 'sweet-bonanza'
  name: text('name').notNull(),
  provider: text('provider').notNull(), // 'pragmatic', 'evolution'
  providerGameId: text('provider_game_id').notNull(),
  img: text('img'),

  // Финансовый контроль
  houseEdge: numeric('house_edge', { precision: 5, scale: 2 }).default('3.00'), // 3%
  rtp: numeric('rtp', { precision: 5, scale: 2 }).default('97.00'),

  minBetUsd: numeric('min_bet_usd', { precision: 10, scale: 2 }).default(
    '0.10',
  ),
  maxBetUsd: numeric('max_bet_usd', { precision: 10, scale: 2 }).default(
    '1000.00',
  ),
  maxWinUsd: numeric('max_win_usd', { precision: 12, scale: 2 }), // Cap win (например $1M)

  isActive: boolean('is_active').default(true),
  isDemoEnabled: boolean('is_demo_enabled').default(true),
});
