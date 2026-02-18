import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL')?.split(','),
    credentials: true, // Allow cookies
  });

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  // await app.listen(config.get('PORT') || 8000);

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
