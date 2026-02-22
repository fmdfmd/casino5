import { InferSelectModel, relations } from 'drizzle-orm';

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  text,
  index,
  uniqueIndex,
  numeric,
} from 'drizzle-orm/pg-core';
import { kycStatusEnum, userRoleEnum, userStatusEnum } from './enums.schema';
import { rolesTable } from './roles.schema';
import { userRolesTable } from './user-roles.schema';
import { walletsTable } from './wallets.schema';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // --- 1. Identity & Auth (Исправлено: возвращены поля провайдеров) ---
    email: varchar('email', { length: 255 }).unique().notNull(),
    username: varchar('username', { length: 50 }).unique(), // Никнейм для чата (анонимный)

    // Пароль может отсутствовать, если вход через Google/Wallet
    passwordHash: text('password_hash'),

    // OAuth поля (Google, Telegram, Metamask)
    provider: varchar('provider', { length: 50 }).default('local').notNull(),
    providerId: varchar('provider_id', { length: 255 }), // ID от Google/Meta

    // --- 2. Profile & UX (Исправлено: возвращена картинка) ---
    picture: text('picture'), // URL аватарки
    firstName: varchar('first_name', { length: 100 }), // Реальное имя (для писем/KYC)
    lastName: varchar('last_name', { length: 100 }),

    // --- 3. Security (CRITICAL for Crypto Casino) ---
    // Обязательно для защиты аккаунтов с деньгами
    twoFactorSecret: text('2fa_secret'),
    isTwoFactorEnabled: boolean('is_2fa_enabled').default(false),

    // Refresh Token Rotation (Безопасность сессий)
    refreshTokenHash: text('refresh_token_hash'),

    // --- 4. Compliance & Risk (KYC / AML) ---
    kycLevel: kycStatusEnum('kyc_level').default('none').notNull(), // none -> level_1 -> level_2
    status: userStatusEnum('status').default('active').notNull(), // active, suspended, banned

    // Risk Score: 0 (Good) -> 100 (Fraud).
    // Если > 80, авто-вывод блокируется до ручной проверки.
    riskScore: integer('risk_score').default(0),

    // --- 5. Affiliate System (Stake-like) ---
    // affiliateCode: varchar('affiliate_code', { length: 20 }).unique(), // Мой код для приглашения других
    // referredBy: uuid('referred_by'), // Кто пригласил меня (ссылка на users.id)

    // >> НОВОЕ: VIP / Loyalty State <<
    vipLevel: integer('vip_level').default(0).notNull(),
    totalWageredUsd: numeric('total_wagered_usd', { precision: 20, scale: 2 })
      .default('0')
      .notNull(),

    // >> НОВОЕ: Баланс для мгновенных наград, которые нужно "забрать" <<
    rakebackBalanceUsd: numeric('rakeback_balance_usd', {
      precision: 18,
      scale: 4,
    })
      .default('0')
      .notNull(),
    affiliateCommissionBalanceUsd: numeric('affiliate_commission_balance_usd', {
      precision: 18,
      scale: 4,
    })
      .default('0')
      .notNull(),

    // --- 6. Meta ---
    isOnline: boolean('is_online').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(), // Авто-обновление через триггер или на уровне APP
  },
  (t) => [
    // Индексы для скорости поиска
    uniqueIndex('users_email_idx').on(t.email),
    uniqueIndex('users_username_idx').on(t.username),
    index('users_provider_idx').on(t.provider, t.providerId),
    index('idx_users_vip_level').on(t.vipLevel), // Индекс по VIP уровню
  ],
);
export const usersRelations = relations(users, ({ many }) => ({
  userRolesTable: many(userRolesTable),
  walletsTable: many(walletsTable),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserWithRoles = User & {
  userRolesTable: {
    role: InferSelectModel<typeof rolesTable>;
  }[];
};
