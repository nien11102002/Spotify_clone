import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

@ApiBearerAuth()
@Controller('follow')
export class FollowController {
  constructor(@Inject('FOLLOW_NAME') private followService: ClientProxy) {}

  @Get('is-following')
  async isFollowing(
    @Param('userId') userId: string,
    @Param('followingUserId') followingUserId: string,
  ) {
    console.log('API isFollowing called', { userId, followingUserId });
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
    console.log('API sendFollow called', { userId, followingUserId });
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
    console.log('API unfollow called', { userId, followingUserId });
    const result = await lastValueFrom(
      this.followService.send('unfollow', { userId, followingUserId }),
    );
    return result;
  }
}
