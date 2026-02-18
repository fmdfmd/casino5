import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { BullModule } from '@nestjs/bullmq';
import { GamesModule } from './games/games.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CurrenciesModule } from './currencies/currencies.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WalletModule } from './wallet/wallet.module';
import { DepositModule } from './deposit/deposit.module';
import { TronModule } from './tron/tron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { VipModule } from './vip/vip.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET')!,
        signOptions: {
          expiresIn: config.get<any>('JWT_ACCESS_EXPIRES', '15m')!,
        },
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        };
      },
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/currenciesIcons',
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    RolesModule,
    GamesModule,
    CurrenciesModule,
    WalletModule,
    DepositModule,
    TronModule,
    ScheduleModule.forRoot(),
    AdminModule,
    AffiliateModule,
    VipModule,
  ],
  controllers: [AppController],
  providers: [DrizzleModule, AppService],
})
export class AppModule {}
