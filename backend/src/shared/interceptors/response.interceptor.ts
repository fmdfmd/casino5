import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ApiResponse } from '../types/api-response';
import { SKIP_RESPONSE_INTERCEPTOR } from '../decorators/skip-response.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_INTERCEPTOR,
      [
        context.getHandler(), // сначала метод
        context.getClass(), // потом controller
      ],
    );

    // 👉 если стоит декоратор — ничего не оборачиваем
    if (skip) {
      return next.handle();
    }

    // 👉 обычное поведение
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
