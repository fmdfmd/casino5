import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';

import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { gamesTable } from 'src/drizzle/schema/games.schema';
import { SkipResponseInterceptor } from 'src/shared/decorators/skip-response.decorator';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';
import { eq } from 'drizzle-orm';
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  /**
   * 🎰 1. ГЛАВНЫЙ CALLBACK (Эндпоинт для Игрового Сервера)
   * Этот URL (например, https://api.yourcasino.com/games/callback)
   * нужно указать в панели администратора интеграции как "Callback URL".
   * Сюда приходят команды getBalance и writeBet.
   */
  @Post('callback')
  @SkipResponseInterceptor() // ВАЖНО: чтобы NestJS не оборачивал ответ в свой формат { data: ... }
  async providerCallback(@Body() body: any) {
    // Внутри handleCallback уже реализована вся проверка key, расчет баланса и запись логов
    return await this.gamesService.handleCallback(body);
  }

  /**
   * 📋 2. ЛОББИ - Список всех доступных игр
   * Вызывается вашим фронтендом для отрисовки сетки игр.
   */
  @Get('list')
  async getAllGames() {
    try {
      // Возвращаем только активные игры
      return await this.db.query.gamesTable.findMany({
        where: eq(gamesTable.isActive, true),
      });
    } catch (err) {
      console.error('Fetch games error:', err);
      return [];
    }
  }

  /**
   * 🚀 3. ОТКРЫТИЕ ИГРЫ
   * Вызывается фронтендом, когда авторизованный юзер нажимает "Играть".
   */
  @Post('open')
  @UseGuards(AccessTokenGuard)
  async openGame(
    @Body('id') id: string,
    @Body('demo') demo = false,
    @Req() req,
  ) {
    // req.user.sub — это UUID пользователя из вашего JWT токена
    const userId = req.user.sub;
    return await this.gamesService.openGame(id, demo, userId);
  }

  /**
   * 🏆 4. ДЖЕКПОТЫ
   * Возвращает текущие суммы джекпотов для отображения на сайте.
   */
  // @Get('jackpots')
  // async getJackpots() {
  //   return await this.gamesService.getJackpots();
  // }

  /**
   * 📜 5. ИГРОВЫЕ ЛОГИ (Для истории ставок пользователя)
   * Позволяет получить детальные логи конкретной сессии.
   */
  // @Get('logs/:sessionId')
  // @UseGuards(AccessTokenGuard)
  // async getLogs(
  //   @Param('sessionId') sessionId: string,
  //   @Query('page') page = 1,
  //   @Query('count') count = 20,
  // ) {
  //   return await this.gamesService.getLogs(sessionId, Number(page), Number(count));
  // }

  /**
   * 🚪 6. ЗАКРЫТИЕ ИГРЫ
   * Сюда провайдер перенаправляет пользователя (ExitUrl), когда тот нажимает кнопку "Выход" в игре.
   */
  @Get('close')
  closeGame() {
    // Можно сделать редирект обратно на главную страницу или просто вернуть статус
    return { status: 'ok', message: 'Game session ended' };
  }

  /**
   * ❤️ 7. HEALTH CHECK
   * Для мониторинга работоспособности игрового шлюза.
   */
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
