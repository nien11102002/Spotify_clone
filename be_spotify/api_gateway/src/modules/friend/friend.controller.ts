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

@Controller('friend')
export class FriendController {
  constructor(@Inject('FRIEND_NAME') private friendService: ClientProxy) {}

  @Public()
  @Post('/add-friend')
  async addFriend(@Body() addFriendDto: AddFriendDto) {
    return this.friendService.emit('add-friend', addFriendDto);
  }

  @Public()
  @Delete('/delete-friend/:friendId')
  async deleteFriend(@Param('friendId') friendId: string) {
    return this.friendService.emit('delete-friend', { friendId });
  }

  @Public()
  @Get('/get-list-friend/:id')
  async getListFriend(@Param('id') id: string) {
    const friendList = lastValueFrom(
      this.friendService.send('get-list-friend', { id }).pipe(
        catchError((err) => {
          const { statusCode = 500, message = 'Internal server error' } = err;
          return throwError(() => new HttpException(message, statusCode));
        }),
      ),
    );
  }
}
