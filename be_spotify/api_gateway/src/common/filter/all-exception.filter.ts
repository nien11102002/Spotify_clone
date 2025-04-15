// common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody['message']) {
        message = Array.isArray(responseBody['message'])
          ? responseBody['message'][0]
          : responseBody['message'];
      }
    } else if (exception?.message) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      content: null,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    });
  }
}
