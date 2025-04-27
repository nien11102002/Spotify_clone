import {
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/public.decorator';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(@Inject('USER_NAME') private userService: ClientProxy) {}

  @Get(`/all-users`)
  async getAllUsers() {
    console.log('API getAllUsers called');
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

  @Get(`/find-user/:id`)
  async findUserById(@Param('id') id: string) {
    console.log('API findUserById called', { id });
    try {
      const user = await lastValueFrom(
        this.userService.send('find-user', { id }).pipe(handleRpcError()),
      );
      return user;
    } catch (err) {
      throw err;
    }
  }
}
