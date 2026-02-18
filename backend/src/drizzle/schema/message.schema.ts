import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';
import { InferSelectModel } from 'drizzle-orm';
import { users } from './users.schema';
import { chats } from './chats.schema';
import { guestSessions } from './guest-session.schema';
import { messageTypeEnum } from './enums.schema';

export const messagesTable = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    chatId: uuid('chat_id')
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),

    senderUserId: uuid('sender_user_id').references(() => users.id),
    senderGuestId: uuid('sender_guest_id').references(() => guestSessions.id),

    type: messageTypeEnum('type').default('text').notNull(),
    content: text('content').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    editedAt: timestamp('edited_at'),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => ({
    chatIdx: index('idx_messages_chat_id').on(t.chatId),
    createdIdx: index('idx_messages_created_at').on(t.createdAt),
  }),
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  chat: one(chats, {
    fields: [messagesTable.chatId],
    references: [chats.id],
  }),
  senderUser: one(users, {
    fields: [messagesTable.senderUserId],
    references: [users.id],
  }),
  senderGuest: one(guestSessions, {
    fields: [messagesTable.senderGuestId],
    references: [guestSessions.id],
  }),
}));

export type MessageType = InferSelectModel<typeof messagesTable>;
export type NewMessageType = InferInsertModel<typeof messagesTable>;
