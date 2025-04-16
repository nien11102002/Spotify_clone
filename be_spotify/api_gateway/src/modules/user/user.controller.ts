import { Controller, Get, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/public.decorator';
import { catchError, lastValueFrom, throwError } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_NAME') private userService: ClientProxy) {}

  @Public()
  @Get(`/all-users`)
  async getAllUsers() {
    try {
      const allUsers = await lastValueFrom(
        this.userService.send('all-users', {}).pipe(
          catchError((err) => {
            const { statusCode = 500, message = 'Internal server error' } = err;
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
      return allUsers;
    } catch (err) {
      throw err;
    }
  }
}
