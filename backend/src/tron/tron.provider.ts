import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TronWeb } from 'tronweb';

export const TRON_WEB = 'TRON_WEB';

export const TronWebProvider: Provider = {
  provide: TRON_WEB,

  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const fullNode = configService.getOrThrow('TRON_FULL_NODE');
    const apiKey = configService.get<string>('TRONGRID_API_KEY');
    const tronWeb = new TronWeb({
      // fullHost: fullNode,
      fullHost: 'https://nile.trongrid.io', // <--- ТЕСТОВАЯ СЕТЬ NILE
      headers: {
        'TRON-PRO-API-KEY': apiKey,
      },
    });
    return tronWeb;
  },
};
