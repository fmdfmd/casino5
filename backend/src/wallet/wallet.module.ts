import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DepositModule } from 'src/deposit/deposit.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { UsersRepository } from 'src/users/users.repository';
import { CryptoScannerService } from './crypto-scanner.service';
import { TronWebProvider } from 'src/tron/tron.provider';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    AccessTokenGuard,
    UsersRepository,
    CryptoScannerService,
    TronWebProvider,
  ],
  imports: [DepositModule, DrizzleModule],
})
export class WalletModule {}
