import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  numeric,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { walletsTable } from './wallets.schema';

export const currenciesTable = pgTable(
  'currencies',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // Основные данные
    symbol: text('symbol').notNull(), // 'BTC', 'USDT', 'ETH'
    network: text('network').notNull(), // 'Bitcoin', 'ERC20', 'TRC20'
    name: text('name').notNull(), // 'Bitcoin', 'Tether USD'

    // Живые данные
    priceUsd: numeric('price_usd', { precision: 18, scale: 8 })
      .notNull()
      .default('0'),
    lastPriceUpdate: timestamp('last_price_update'),

    // Лимиты и статусы
    isActive: boolean('is_active').default(true),
    isDepositEnabled: boolean('is_deposit_enabled').default(true),
    isWithdrawalEnabled: boolean('is_withdrawal_enabled').default(true),

    icon: text('icon'),

    // Конфигурация
    decimals: integer('decimals').notNull().default(8),
    minDeposit: numeric('min_deposit', { precision: 36, scale: 18 }).default(
      '0',
    ),
    minWithdrawal: numeric('min_withdrawal', {
      precision: 36,
      scale: 18,
    }).default('0'),
    withdrawalFee: numeric('withdrawal_fee', {
      precision: 36,
      scale: 18,
    }).default('0'),

    // Блокчейн
    contractAddress: text('contract_address'), // NULL for native
    minConfirmations: integer('min_confirmations').default(1),
  },
  (t) => [
    // Уникальная пара Символ + Сеть (чтобы не было двух USDT ERC20)
    uniqueIndex('uniq_curr_symbol_network').on(t.symbol, t.network),
  ],
);

export const currenciesRelations = relations(currenciesTable, ({ many }) => ({
  wallets: many(walletsTable),
}));
