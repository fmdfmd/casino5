import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { HttpModule } from '@nestjs/axios';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { UsersModule } from 'src/users/users.module';
import { AdminGateway } from 'src/admin/admin.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { VipModule } from 'src/vip/vip.module';
import { AffiliateModule } from 'src/affiliate/affiliate.module';

@Module({
  controllers: [GamesController],
  providers: [GamesService, ConfigService, AccessTokenGuard, AdminGateway],
  imports: [
    HttpModule,
    DrizzleModule,
    UsersModule,
    ChatModule,
    VipModule,
    AffiliateModule,
  ],
})
export class GamesModule {}
