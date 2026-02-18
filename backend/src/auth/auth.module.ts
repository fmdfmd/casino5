import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersModule } from '../users/users.module'; // <-- Import UsersModule
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy'; // Don't forget strategies
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { APP_GUARD } from '@nestjs/core';
import { BcryptHashService } from './bcrypt.service';
import { HashService } from './hash.service';
import { AccessTokenGuard } from './guards/jwt.guard';
import { UsersRepository } from 'src/users/users.repository';
import { AbilityFactory } from 'src/casl/AbilityFactory';

@Module({
  imports: [DrizzleModule, UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtRefreshGuard,
    AccessTokenGuard,
    AbilityFactory,
    {
      provide: HashService,
      useClass: BcryptHashService,
    },
  ],
})
export class AuthModule {}
