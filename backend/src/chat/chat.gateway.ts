import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { InitChatDto, SendMessageDto, UserRole } from './dto/chat.dto';
import { ChatJwtGuard } from './guards/chat-jwt.guard';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ChatJwtAdminGuard } from './guards/chat-jwt-admin.guard';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersRepository } from 'src/users/users.repository';
import { messagesTable } from 'src/drizzle/schema/message.schema';
import { ChatBalancerService } from './chat-balance.service';
import { eq } from 'drizzle-orm';
import { chats } from 'src/drizzle/schema/chats.schema';
import { chatParticipantsTable } from 'src/drizzle/schema/chat-participants.schema';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('SupportChat');

  constructor(
    private readonly chatService: ChatService,
    @InjectQueue('message') private messageQueue: Queue,
    @Inject(DRIZZLE) private db: DrizzleDB,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly usersRepo: UsersRepository,
    private readonly chatBalancer: ChatBalancerService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = this.extractToken(client) ?? '';

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        roles: string[];
      }>(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      const userId = payload.sub;
      const user = await this.usersRepo.findById(userId, {
        withRoles: true,
      });

      const userRolesTable = user!.userRolesTable.map((r) => {
        return r.role.name;
      });

      // console.log(payload, 'payload');
      if (userRolesTable.includes('OPERATOR')) {
        // if (await this.cache.get(payload.sub)) {

        // }

        await this.cache.set(`operators:${payload.sub}`, client.id);
      }
    } catch (err) {}
  }

  async handleDisconnect(client: Socket) {}

  @SubscribeMessage('init')
  @UseGuards(ChatJwtAdminGuard)
  async init(@ConnectedSocket() client: Socket) {}

  @SubscribeMessage('leavePublicChat')
  @UseGuards(ChatJwtAdminGuard)
  async leavePublicChat(@ConnectedSocket() client: Socket) {
    const chatId = client.data.chatId;
    if (!chatId) return;

    await this.chatBalancer.leaveChat(chatId, client.id);

    const size = await this.chatBalancer.getChatSize(chatId);
    if (size < 20) {
      await this.tryRebalance(chatId);
    }
  }

  @SubscribeMessage('sendPublicMessage')
  @UseGuards(ChatJwtAdminGuard)
  async sendPublicMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { content: string; tempId: string; chatId: string },
  ) {
    const { chatId } = body;
    const [{ id: messageId }] = await this.db
      .insert(messagesTable)
      .values({
        chatId,
        content: body.content,
        senderUserId: client.data.user.sub,
      })
      .returning();

    const message = await this.db.query.messagesTable.findFirst({
      where: eq(messagesTable.id, messageId),
      with: { senderUser: { columns: { firstName: true } } },
    });

    client.to(chatId).emit('publicMessage', message);

    client.emit('publicMessage:confirm', { ...message, tempId: body.tempId });

    return {
      success: true,
      data: message,
      tempId: body.tempId,
    };
  }

  @SubscribeMessage('sendSupportMessageOperator')
  @UseGuards(ChatJwtGuard)
  async sendSupportMessageOperator(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { content: string; chatId: string },
  ) {
    try {
      if (body.chatId) {
        const chat = await this.db.query.chats.findFirst({
          where: (chats) => eq(chats.id, body.chatId),
        });
        if (chat) {
          const [message] = await this.db
            .insert(messagesTable)
            .values({
              chatId: body.chatId,
              content: body.content,
              senderUserId: client.data.user.sub,
            })
            .returning();

          // await this.db
          //   .insert(chatParticipantsTable)
          //   .values({ chatId: body.chatId, userId: client.data.user.sub });
          this.server.to(body.chatId).emit('supportMessage', message);
        }
      } else {
        const [chat] = await this.db
          .insert(chats)
          .values({ type: 'support' })
          .returning();

        const [message] = await this.db
          .insert(messagesTable)
          .values({
            chatId: chat.id,
            content: body.content,
            senderUserId: client.data.user.sub,
          })
          .returning();
        this.server.to(chat.id).emit('supportMessage', message);
      }
    } catch (err) {}
  }

  @SubscribeMessage('sendSupportMessage')
  @UseGuards(ChatJwtGuard)
  async sendSupportMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { content: string; tempId: string; chatId: string },
  ) {
    try {
      if (body.chatId) {
        const chat = await this.db.query.chats.findFirst({
          where: (chats) => eq(chats.id, body.chatId),
        });

        if (chat) {
          const [message] = await this.db
            .insert(messagesTable)
            .values({
              chatId: body.chatId,
              content: body.content,
              senderUserId: client.data.user.sub,
            })
            .returning();

          // await this.db
          //   .insert(chatParticipantsTable)
          //   .values({ chatId: body.chatId, userId: client.data.user.sub });
          this.server.to(body.chatId).emit('supportMessage', message);
        }
      } else {
        const [chat] = await this.db
          .insert(chats)
          .values({ type: 'support' })
          .returning();

        const [message] = await this.db
          .insert(messagesTable)
          .values({
            chatId: chat.id,
            content: body.content,
            senderUserId: client.data.user.sub,
          })
          .returning();
        client.emit('supportChatId', chat.id);
        client.to(chat.id).emit('supportMessage', message);
        // this.server.to(body.chatId).emit('newSession', chat);
        this.server.emit('newSession', chat);
      }
    } catch (err) {
      console.log(err, 'err');
    }
  }

  @SubscribeMessage('joinSupportChat')
  async joinSupportChat(
    @MessageBody() body: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (body.chatId) {
        client.join(body.chatId);
      }
    } catch (err) {}
  }

  @SubscribeMessage('joinPublicChat')
  async joinPublicChat(@ConnectedSocket() client: Socket) {
    const chatId = await this.chatBalancer.allocateChat();

    await this.chatBalancer.joinChat(chatId, client.id);
    client.join(chatId);
    client.data.chatId = chatId;
    return {
      success: true,
      data: { chatId },
    };
  }

  private extractToken(client: Socket): string | null {
    const cookie = client.handshake.headers.cookie;
    if (!cookie) return null;

    const match = cookie.match(/access_token=([^;]+)/);
    return match?.[1] ?? null;
  }

  private async tryRebalance(chatId: string) {
    const targetChat = await this.chatBalancer.findBetterChat(chatId);
    if (!targetChat) return;

    const sockets = await this.chatBalancer.getSockets(chatId);

    for (const socketId of sockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (!socket) continue;

      await this.chatBalancer.leaveChat(chatId, socketId);
      await this.chatBalancer.joinChat(targetChat, socketId);

      socket.leave(chatId);
      socket.join(targetChat);
      socket.data.chatId = targetChat;

      socket.emit('chatMigrated', { chatId: targetChat });
    }
  }

  sendTransaction(data: any) {
    this.server.emit('new_transaction', data);
  }
}
