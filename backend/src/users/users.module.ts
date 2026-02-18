import { Module } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [UsersController],
  providers: [UsersServices, UsersRepository],
  exports: [UsersServices, UsersRepository],
})
export class UsersModule {}
