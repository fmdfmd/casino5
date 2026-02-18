import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const guestSessions = pgTable('guest_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  ip: varchar('ip', { length: 64 }),
  userAgent: varchar('user_agent', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});
