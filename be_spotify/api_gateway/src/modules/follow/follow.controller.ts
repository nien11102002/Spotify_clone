import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('follow')
export class FollowController {
  constructor(@Inject('FOLLOW_NAME') private followService: ClientProxy) {}

  @Get('is-following')
  async isFollowing(
    @Param('userId') userId: string,
    @Param('followingUserId') followingUserId: string,
  ) {
    const isFollowing = await lastValueFrom(
      this.followService.send('is-following', { userId, followingUserId }),
    );
    return isFollowing;
  }

  @Post('send-follow')
  async sendFollow(
    @Param('userId') userId: string,
    @Param('followingUserId') followingUserId: string,
  ) {
    const isFollowing = await lastValueFrom(
      this.followService.send('send-follow', { userId, followingUserId }),
    );
    return isFollowing;
  }

  @Delete('unfollow')
  async unfollow(
    @Param('userId') userId: string,
    @Param('followingUserId') followingUserId: string,
  ) {
    const result = await lastValueFrom(
      this.followService.send('unfollow', { userId, followingUserId }),
    );
    return result;
  }
}
