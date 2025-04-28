import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { send } from 'process';
import { lastValueFrom } from 'rxjs';
import { FollowDto } from './dto/follow.dto';

@ApiBearerAuth()
@Controller('follow')
export class FollowController {
  constructor(@Inject('FOLLOW_NAME') private followService: ClientProxy) {}

  @Get('is-following')
  async isFollowing(
    @Query('userId') userId: string,
    @Query('followingUserId') followingUserId: string,
  ) {
    console.log('API isFollowing called', { userId, followingUserId });
    const isFollowing = await lastValueFrom(
      this.followService.send('is-following', { userId, followingUserId }),
    );
    return isFollowing;
  }

  @Post('send-follow')
  async sendFollow(@Body() followDto: FollowDto) {
    console.log('API sendFollow called', { followDto });
    const isFollowing = await lastValueFrom(
      this.followService.send('send-follow', { followDto }),
    );
    return isFollowing;
  }

  @Delete('unfollow')
  async unfollow(@Body() followDto: FollowDto) {
    console.log('API unfollow called', { followDto });
    const result = await lastValueFrom(
      this.followService.send('unfollow', { followDto }),
    );
    return result;
  }
}
