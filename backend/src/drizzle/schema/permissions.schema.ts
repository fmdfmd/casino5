import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';

export const permissionsTable = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
});

export type PermissionsType = InferSelectModel<typeof permissionsTable>;
export type NewPermissionsType = InferInsertModel<typeof permissionsTable>;
