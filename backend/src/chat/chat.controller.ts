import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { UsersRepository } from 'src/users/users.repository';
import { ChatService } from './chat.service';
import type { Cache } from 'cache-manager';
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import type { Request } from 'express';
import { messagesTable } from 'src/drizzle/schema/message.schema';
import { chatTypeEnum } from 'src/drizzle/schema/enums.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @InjectQueue('message') private messageQueue: Queue,
    @Inject(DRIZZLE) private db: DrizzleDB,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly usersRepo: UsersRepository,
  ) {}

  @Get()
  async findChat() {
    try {
      return await this.db.query.messagesTable.findMany();
    } catch (err) {}
  }

  @Get('myMessages')
  @UseGuards(AccessTokenGuard)
  async getMyMessages(@Query('chatId') chatId: string, @Req() req) {
    const userId = req.user.sub;
    try {
      const messages = await this.db.query.messagesTable.findMany({
        where: and(eq(messagesTable.chatId, chatId)),
        with: { senderUser: { columns: { firstName: true } } },
      });

      return messages;
    } catch (err) {
      console.error('Ошибка при получении сообщений:', err);
      return [];
    }
  }

  @Get('supportChats')
  @UseGuards(AccessTokenGuard)
  async getSupportChats(@Req() req) {
    try {
      const userId = req.user.sub;

      const chats = await this.db.query.chats.findMany({
        where: (chats) => eq(chats.type, 'support'),
      });
      return chats;
    } catch (err) {
      return [];
    }
  }

  @Get('supportChatMessages')
  @UseGuards(AccessTokenGuard)
  async getSupportChatMessages(@Query('chatId') chatId: string) {
    try {
      const messages = this.db.query.messagesTable.findMany({
        where: (messages) => eq(messages.chatId, chatId),
      });

      return messages;
    } catch (err) {
      return [];
    }
  }

  @Get('mySupportMessages')
  @UseGuards(AccessTokenGuard)
  async getMySupportMessages(@Query('chatId') chatId: string) {
    try {
      const messages = this.db.query.messagesTable.findMany({
        where: (messages) => eq(messages.chatId, chatId),
      });

      return messages;
    } catch (err) {
      return [];
    }
  }
}
