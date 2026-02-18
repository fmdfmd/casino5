import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  controllers: [DepositController],
  providers: [DepositService, AccessTokenGuard, UsersRepository],
  exports: [DepositService],
  imports: [DrizzleModule],
})
export class DepositModule {}
