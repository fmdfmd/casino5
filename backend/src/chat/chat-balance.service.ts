import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { randomUUID } from 'crypto';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { chats } from 'src/drizzle/schema/chats.schema';

@Injectable()
export class ChatBalancerService {
  private readonly MAX_USERS = 10_000;
  private readonly MIN_ACTIVE_USERS = 20;

  constructor(
    private readonly redis: Redis,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  async allocateChat(): Promise<string> {
    const chatIds = await this.redis.smembers('public:chats:active');

    let bestChat: string | null = null;
    let bestCount = -1;

    for (const chatId of chatIds) {
      const count = Number(await this.redis.get(`public:chat:${chatId}:count`));
      if (count < this.MAX_USERS && count > bestCount) {
        bestChat = chatId;
        bestCount = count;
      }
    }

    if (bestChat) return bestChat;

    const [newChat] = await this.db
      .insert(chats)
      .values({ type: 'public' })
      .returning();
    const { id: newChatId } = newChat;

    await this.redis.sadd('public:chats:active', newChatId);
    await this.redis.set(`public:chat:${newChatId}:count`, 0);
    return newChatId;
  }

  async joinChat(chatId: string, socketId: string) {
    await this.redis
      .multi()
      .incr(`public:chat:${chatId}:count`)
      .sadd(`public:chat:${chatId}:sockets`, socketId)
      .exec();
  }

  async leaveChat(chatId: string, socketId: string) {
    //@ts-expect-error
    const [[_, count]] = await this.redis
      .multi()
      .decr(`public:chat:${chatId}:count`)
      .srem(`public:chat:${chatId}:sockets`, socketId)
      .exec();

    if (count <= 0) {
      await this.redis.srem('public:chats:active', chatId);
      await this.redis.del(`public:chat:${chatId}:count`);
      await this.redis.del(`public:chat:${chatId}:sockets`);
    }
  }

  async getChatSize(chatId: string) {
    return Number(await this.redis.get(`public:chat:${chatId}:count`));
  }

  async getSockets(chatId: string) {
    return this.redis.smembers(`public:chat:${chatId}:sockets`);
  }

  async findBetterChat(currentChatId: string) {
    const chats = await this.redis.smembers('public:chats:active');

    let bestChat: string | null = null;
    let bestCount = -1;

    for (const chatId of chats) {
      if (chatId === currentChatId) continue;
      const count = Number(await this.redis.get(`public:chat:${chatId}:count`));
      if (count > bestCount) {
        bestChat = chatId;
        bestCount = count;
      }
    }

    if (bestCount >= this.MIN_ACTIVE_USERS) return bestChat;
    return null;
  }
}
