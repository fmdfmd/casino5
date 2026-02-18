import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { APP_GUARD } from '@nestjs/core';
import { TestGuard } from './test.guard';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { AbilityFactory } from 'src/casl/AbilityFactory';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RolesController],
  imports: [UsersModule],
  providers: [
    RolesService,
    AbilityFactory,
    // {
    //   provide: APP_GUARD,
    //   useClass: TestGuard,
    // },
    // AccessTokenGuard,
  ],
})
export class RolesModule {}
