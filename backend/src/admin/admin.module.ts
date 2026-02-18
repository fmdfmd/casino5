import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminFinanceController } from './admin.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersModule } from 'src/users/users.module';
import { AdminGateway } from './admin.gateway';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  controllers: [AdminFinanceController],
  providers: [AdminService, AdminGateway, UsersRepository],
  imports: [DrizzleModule, UsersModule],
})
export class AdminModule {}
