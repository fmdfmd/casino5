import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SkipResponseInterceptor } from './shared/decorators/skip-response.decorator';
import { AccessTokenGuard } from './auth/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Post()
  @SkipResponseInterceptor()
  test(@Body() body: any, @Req() req) {
    console.log('Received body:', body);
    // console.log(req?.user, 'req');

    console.log('balance');
    return {
      status: 'success',
      error: '',
      login: 'test',
      balance: '1000.00',
      currency: 'LAK',
    };
  }
}

//307752149 - chrome
