import { Controller, Get } from '@nestjs/common';
import { TronService } from './tron.service';

@Controller('tron')
export class TronController {
  constructor(private readonly tronService: TronService) {}

  @Get()
  async test() {
    const wallet = await this.tronService.deriveTronAddress(12);
    console.log(wallet, 'wallet');
  }
}
