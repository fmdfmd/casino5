import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { and, eq, sql } from 'drizzle-orm';

@Controller('currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  // @Get()
  // @UseGuards(AccessTokenGuard)
  // async getCurrencies(@Req() req) {
  //   try {
  //     const userId = req.user.sub;

  //     const currenciesData = await this.db.query.currenciesTable.findMany({
  //       where: eq(currenciesTable.isActive, true),
  //       with: {
  //         wallets: {
  //           // Важнейший фильтр: грузим кошелек ТОЛЬКО для этого юзера
  //           where: eq(walletsTable.userId, userId),
  //           limit: 1,
  //         },
  //       },
  //     });

  //     const result = currenciesData.map((currency) => {
  //       const userWallet = currency.wallets[0];

  //       return {
  //         ...currency,
  //         balance: userWallet ? userWallet.balance : '0',
  //         lockedBalance: userWallet ? userWallet.lockedBalance : '0',
  //       };
  //     });

  //     return result;
  //   } catch (err) {
  //     console.log(err, 'err');
  //   }
  // }
}
