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

// --- КОНФИГУРАЦИЯ (Заполняется админом в админ-панели) ---
export const vipConfigTable = pgTable('vip_config', {
  level: integer('level').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // e.g., "Platinum III"
  wagerRequiredUsd: numeric('wager_required_usd', {
    precision: 20,
    scale: 2,
  }).notNull(),

  // Статические награды
  levelUpBonusUsd: numeric('level_up_bonus_usd', {
    precision: 12,
    scale: 2,
  }).default('0'),

  // Коэффициенты для динамических наград
  rakebackRate: numeric('rakeback_rate', { precision: 5, scale: 2 }).default(
    '5.00',
  ), // % от House Edge
  weeklyBoostBaseRate: numeric('weekly_boost_base_rate', {
    precision: 8,
    scale: 4,
  }).default('0.0500'), // 0.05% от вейджера за 7 дней
  monthlyBonusBaseRate: numeric('monthly_bonus_base_rate', {
    precision: 8,
    scale: 4,
  }).default('0.0250'), // 0.025% от вейджера за 30 дней
});
