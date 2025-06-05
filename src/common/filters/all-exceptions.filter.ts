import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let reason = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      reason =
        typeof res === 'string'
          ? res
          : (res as any).message || (res as any).error || reason;
    } else if (exception instanceof Error) {
      reason = exception.message;
    }

    response.status(status).json({
      status,
      reason,
      date: new Date(),
    });
  }
}
