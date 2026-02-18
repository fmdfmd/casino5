import { Module } from '@nestjs/common';
import { TronService } from './tron.service';
import { TronController } from './tron.controller';
import { TronWebProvider } from './tron.provider';

@Module({
  controllers: [TronController],
  providers: [TronService, TronWebProvider],
})
export class TronModule {}
