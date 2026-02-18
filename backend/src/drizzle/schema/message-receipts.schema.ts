import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { deliveryStatusEnum } from './enums.schema';

import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { messagesTable } from './message.schema';

export const messageReceiptsTable = pgTable(
  'message_receipts',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    messageId: uuid('message_id')
      .notNull()
      .references(() => messagesTable.id, { onDelete: 'cascade' }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    status: deliveryStatusEnum('status').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    uniq: index('uq_message_receipts_message_user').on(t.messageId, t.userId),
  }),
);

export const messageReceiptsRelations = relations(
  messageReceiptsTable,
  ({ one }) => ({
    message: one(messagesTable, {
      fields: [messageReceiptsTable.messageId],
      references: [messagesTable.id],
    }),
    user: one(users, {
      fields: [messageReceiptsTable.userId],
      references: [users.id],
    }),
  }),
);
