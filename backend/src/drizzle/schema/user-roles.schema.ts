import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { rolesTable } from './roles.schema';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { primaryKey } from 'drizzle-orm/pg-core';

export const userRolesTable = pgTable(
  'user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => rolesTable.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.userId] })],
);

export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
  user: one(users, {
    fields: [userRolesTable.userId],
    references: [users.id],
  }),
  role: one(rolesTable, {
    fields: [userRolesTable.roleId],
    references: [rolesTable.id],
  }),
}));

export type UserRolesType = InferSelectModel<typeof userRolesTable>;
export type NewUserRolesType = InferInsertModel<typeof userRolesTable>;
