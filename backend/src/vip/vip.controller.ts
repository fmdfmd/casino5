import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VipService } from './vip.service';
import { AccessTokenGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(AccessTokenGuard)
@Controller('vip')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Get('info')
  // Мы не требуем обязательной авторизации, чтобы показать уровни гостям,
  // но если токен есть — мы хотим знать прогресс юзера.
  // В вашей реализации Guards может потребоваться кастомный декоратор @Public() или проверка внутри.
  // Для примера предположим, что фронт шлет токен, если он есть.
  async getVipInfo(@Req() req) {
    // Пытаемся достать userId из токена, если он был передан
    // (зависит от вашей настройки Guard, допустим req.user заполняется опционально)
    const userId = req?.user?.sub || null;
    return await this.vipService.getVipPageData(userId);
  }
}
