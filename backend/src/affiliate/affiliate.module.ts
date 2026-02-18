import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { AffiliateController } from './affiliate.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [AffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
  imports: [DrizzleModule],
})
export class AffiliateModule {}
