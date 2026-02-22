import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminFinanceController } from './admin.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersModule } from 'src/users/users.module';
import { AdminGateway } from './admin.gateway';
import { UsersRepository } from 'src/users/users.repository';
import { AdminGamesController } from './admin-games.controller';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-user.controller';

@Module({
  controllers: [
    AdminFinanceController,
    AdminGamesController,
    AdminUsersController,
  ],
  providers: [AdminService, AdminGateway, UsersRepository, AdminUsersService],
  imports: [DrizzleModule, UsersModule],
})
export class AdminModule {}
