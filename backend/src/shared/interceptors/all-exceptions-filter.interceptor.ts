import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus?.() || 500;

    res.status(status).json({
      success: false,
      error: {
        code: exception.code || 'INTERNAL_ERROR',
        message: exception.message || 'Internal server error',
      },
    });
  }
}
