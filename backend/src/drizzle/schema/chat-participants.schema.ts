import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { participantRoleEnum } from './enums.schema';
import { chats } from './chats.schema';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { guestSessions } from './guest-session.schema';

export const chatParticipantsTable = pgTable(
  'chat_participants',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    chatId: uuid('chat_id')
      .notNull()
      .references(() => chats.id, { onDelete: 'cascade' }),

    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').references(() => guestSessions.id, {
      onDelete: 'cascade',
    }),

    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    leftAt: timestamp('left_at'),
  },
  (t) => ({
    chatIdx: index('idx_chat_participants_chat_id').on(t.chatId),
    userIdx: index('idx_chat_participants_user_id').on(t.userId),
    guestIdx: index('idx_chat_participants_guest_id').on(t.guestId),
  }),
);

export const chatParticipantsRelations = relations(
  chatParticipantsTable,
  ({ one }) => ({
    chat: one(chats, {
      fields: [chatParticipantsTable.chatId],
      references: [chats.id],
    }),
    user: one(users, {
      fields: [chatParticipantsTable.userId],
      references: [users.id],
    }),
    guest: one(guestSessions, {
      fields: [chatParticipantsTable.guestId],
      references: [guestSessions.id],
    }),
  }),
);
