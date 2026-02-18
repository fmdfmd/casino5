import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { chatTypeEnum, chatStatusEnum } from './enums.schema';

export const chats = pgTable(
  'chats',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: chatTypeEnum('type').notNull(),
    status: chatStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    closedAt: timestamp('closed_at'),
  },
  (t) => ({
    statusIdx: index('idx_chats_status').on(t.status),
    typeIdx: index('idx_chats_type').on(t.type),
  }),
);
