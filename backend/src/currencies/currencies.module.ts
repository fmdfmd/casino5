import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, AccessTokenGuard, JwtService],
  imports: [DrizzleModule, UsersModule],
})
export class CurrenciesModule {}
