import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { ChatJwtGuard } from './guards/chat-jwt.guard';
import { ChatJwtAdminGuard } from './guards/chat-jwt-admin.guard'; // Не забудьте
import { BullModule } from '@nestjs/bullmq';
import { MessageConsumer } from './chat.consumer';
import { ChatBalancerService } from './chat-balance.service';
import Redis from 'ioredis';

@Module({
  imports: [
    DrizzleModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'message',
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    ChatJwtGuard,
    ChatJwtAdminGuard,
    MessageConsumer,
    ChatGateway,
    ChatBalancerService,
    Redis,
  ],
  exports: [ChatGateway], // Экспортируем, если нужно
})
export class ChatModule {}
