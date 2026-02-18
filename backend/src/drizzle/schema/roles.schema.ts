import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { userRolesTable } from './user-roles.schema';
import { InferSelectModel } from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';

export const rolesTable = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),

  isSystem: boolean('is_system').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  userRolesTable: many(userRolesTable),
}));

export type RolesType = InferSelectModel<typeof rolesTable>;
export type NewRolesType = InferInsertModel<typeof rolesTable>;
