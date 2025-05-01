import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/public.decorator';
import { AddFriendDto } from './dto/add_friend.dto';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TUser } from 'src/common/types/types';
import { User } from 'src/common/decorators/user.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiBearerAuth()
@Controller('friend')
export class FriendController {
  constructor(
    @Inject('FRIEND_NAME') private friendService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('/add-friend')
  async addFriend(@Body() addFriendDto: AddFriendDto, @User() user: TUser) {
    console.log('API addFriend called', { addFriendDto });

    this.cacheManager.del(`friend-list-${user.id}`);

    return this.friendService.emit('add-friend', addFriendDto);
  }

  @Delete('/delete-friend/:friendId')
  async deleteFriend(@Param('friendId') friendId: string, @User() user: TUser) {
    console.log('API deleteFriend called', { friendId });

    this.cacheManager.del(`friend-list-${user.id}`);

    return this.friendService.emit('delete-friend', { friendId });
  }

  @Get('/get-list-friend/:id')
  async getListFriend(@Param('id') id: string, @User() user: TUser) {
    console.log('API getListFriend called', { id });

    if (user.id !== Number(id)) {
      throw new HttpException('Unauthorized', 401);
    }

    const cacheKey = `friend-list-${id}`;
    const cachedFriendList = await this.cacheManager.get(cacheKey);
    if (cachedFriendList) return cachedFriendList;

    const friendList = lastValueFrom(
      this.friendService.send('get-list-friend', { id }).pipe(
        catchError((err) => {
          const { statusCode = 500, message = 'Internal server error' } = err;
          return throwError(() => new HttpException(message, statusCode));
        }),
      ),
    );

    if (friendList) this.cacheManager.set(cacheKey, friendList, 300);

    return friendList;
  }
}
