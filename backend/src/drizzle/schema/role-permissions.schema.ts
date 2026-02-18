import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { rolesTable } from './roles.schema';
import { permissionsTable } from './permissions.schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const rolePermissionsTable = pgTable('role_permissions', {
  roleId: uuid('role_id').references(() => rolesTable.id, {
    onDelete: 'cascade',
  }),
  permissionId: uuid('permission_id').references(() => permissionsTable.id, {
    onDelete: 'cascade',
  }),
});

export type RolePermissionsType = InferSelectModel<typeof rolePermissionsTable>;
export type NewRolePermissionsType = InferInsertModel<
  typeof rolePermissionsTable
>;
