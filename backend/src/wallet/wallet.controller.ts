import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /**
   * 💰 1. Получение всех кошельков пользователя
   * Используется на фронтенде для отображения балансов в шапке и на странице депозита.
   */
  @Get()
  @UseGuards(AccessTokenGuard)
  async getUserWallets(@Req() req) {
    try {
      const userId = req.user.sub; // UUID пользователя из JWT
      const wallets = await this.db.query.walletsTable.findMany({
        where: eq(walletsTable.userId, userId),
        with: {
          currency: true, // Подгружаем данные о валюте (символ, иконка, сеть)
        },
      });

      return wallets;
    } catch (err) {
      console.error('Error fetching wallets:', err);
      throw new InternalServerErrorException('Failed to fetch wallets');
    }
  }

  /**
   * 📍 2. Генерация или получение адреса для депозита
   * Вызывается фронтендом, когда пользователь нажимает "Get Deposit Address".
   */
  @Post('deposit-address')
  @UseGuards(AccessTokenGuard)
  async getDepositAddress(
    @Req() req,
    @Body('currencyId') currencyId: string, // Фронтенд присылает UUID валюты
  ) {
    const userId = req.user.sub;

    if (!currencyId) {
      throw new BadRequestException('currencyId is required');
    }

    try {
      // 1. Сначала найдем символ валюты по её ID (т.к. сервис работает с символами)
      const currency = await this.db.query.currenciesTable.findFirst({
        where: eq(currenciesTable.id, currencyId),
      });

      if (!currency) {
        throw new BadRequestException('Currency not found');
      }

      // 2. Вызываем метод генерации в сервисе
      const address = await this.walletService.generateDepositAddress(
        userId,
        currency.symbol, // Передаем 'USDT', 'BTC' и т.д.
      );

      console.log(address, 'address');

      // Возвращаем объект, который ожидает фронтенд
      return { address };
    } catch (err) {
      console.error('Error generating address:', err);
      throw new InternalServerErrorException(
        err.message || 'Failed to generate deposit address',
      );
    }
  }

  /**
   * 🛠 3. Вебхук для обработки депозитов (System Only)
   * Сюда ваш сканер блокчейна будет присылать данные о найденных транзакциях.
   * В реальном проекте здесь должна быть проверка API-ключа или белого списка IP.
   */
  @Post('webhook/deposit')
  async handleDepositWebhook(@Body() depositDto: any) {
    // Вызываем метод процессинга, который обновляет баланс и пишет Ledger
    return await this.walletService.processDepositWebhook(depositDto);
  }

  @Post('withdraw/request')
  @UseGuards(AccessTokenGuard) // Защищаем от неавторизованных запросов
  async requestWithdrawal(
    @Req() req,
    @Body('walletId') walletId: string,
    @Body('amount') amount: string,
    @Body('address') address: string,
  ) {
    const userId = req.user.sub;

    if (!walletId || !amount || !address) {
      throw new BadRequestException(
        'walletId, amount, and address are required',
      );
    }

    try {
      const payment = await this.walletService.createWithdrawalRequest(
        userId,
        walletId,
        amount,
        address,
      );

      // Опционально: отправить новую заявку админам через WebSocket
      // const fullPaymentData = await this.db.query.paymentsTable.findFirst(...)
      // this.adminGateway.sendNewTransaction(fullPaymentData);

      return {
        success: true,
        message: 'Withdrawal request created successfully.',
        paymentId: payment.id,
      };
    } catch (error) {
      // Ловим ошибки валидации (недостаточно средств и т.д.)
      throw new BadRequestException(error.message);
    }
  }
}
