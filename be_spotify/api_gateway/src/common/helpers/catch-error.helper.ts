import { catchError, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

export function handleRpcError() {
  return catchError((err) => {
    const { statusCode = 500, message = 'Internal server error' } = err;
    return throwError(() => new HttpException(message, statusCode));
  });
}
