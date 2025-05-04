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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Public()
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_NAME') private userService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(`/all-users`)
  async getAllUsers() {
    console.log('API getAllUsers called');

    const cacheKey = 'allUsers';
    const cachedUsers = await this.cacheManager.get(cacheKey);

    if (cachedUsers) return cachedUsers;

    try {
      const allUsers = await lastValueFrom(
        this.userService.send('all-users', {}).pipe(
          catchError((err) => {
            const { statusCode = 500, message = 'Internal server error' } = err;
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );

      if (allUsers) this.cacheManager.set(cacheKey, allUsers);

      return allUsers;
    } catch (err) {
      throw err;
    }
  }

  @Get(`/find-user/:id`)
  async findUserById(@Param('id') id: string) {
    console.log('API findUserById called', { id });

    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheManager.get(cacheKey);
    if (cachedUser) return cachedUser;

    try {
      const user = await lastValueFrom(
        this.userService.send('find-user', { id }).pipe(handleRpcError()),
      );

      if (user) this.cacheManager.set(cacheKey, user);

      return user;
    } catch (err) {
      throw err;
    }
  }
}
