import { pgTable, varchar, bigint } from 'drizzle-orm/pg-core';

export const appSettingsTable = pgTable('app_settings', {
  key: varchar('key', { length: 50 }).primaryKey(), // например 'last_usdt_scan_timestamp'
  value: bigint('value', { mode: 'number' }).notNull(), // timestamp в миллисекундах
});
