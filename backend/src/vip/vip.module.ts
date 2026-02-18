import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipController } from './vip.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  controllers: [VipController],
  providers: [VipService, UsersRepository],
  exports: [VipService],
  imports: [DrizzleModule],
})
export class VipModule {}
