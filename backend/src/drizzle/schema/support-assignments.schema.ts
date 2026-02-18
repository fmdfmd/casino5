import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { chats } from './chats.schema';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';

export const supportAssignmentsTable = pgTable(
  'support_assignments',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    chatId: uuid('chat_id')
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),

    operatorId: uuid('operator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
    releasedAt: timestamp('released_at'),
  },
  (t) => ({
    chatIdx: index('idx_support_assignments_chat_id').on(t.chatId),
    operatorIdx: index('idx_support_assignments_operator_id').on(t.operatorId),
  }),
);

export const supportAssignmentsRelations = relations(
  supportAssignmentsTable,
  ({ one }) => ({
    chat: one(chats, {
      fields: [supportAssignmentsTable.chatId],
      references: [chats.id],
    }),
    operator: one(users, {
      fields: [supportAssignmentsTable.operatorId],
      references: [users.id],
    }),
  }),
);
