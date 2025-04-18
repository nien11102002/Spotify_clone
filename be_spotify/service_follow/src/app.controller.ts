import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('is-following')
  async isFollowing(@Payload() data) {
    const userId = +data.userId;
    const followingUserId = +data.followingUserId;
    const isFollowing = await this.prisma.follow_list.findFirst({
      where: {
        user_id: userId,
        follow_user_id: followingUserId,
      },
    });

    return isFollowing;
  }

  @MessagePattern('send-follow')
  async sendFollow(@Payload() data) {
    const userId = +data.userId;
    const followingUserId = +data.followingUserId;
    const isFollowing = await this.prisma.follow_list.findFirst({
      where: {
        user_id: userId,
        follow_user_id: followingUserId,
      },
    });

    if (isFollowing)
      throw new RpcException({
        status: 400,
        message: 'Already following',
      });

    await this.prisma.follow_list.create({
      data: {
        user_id: userId,
        follow_user_id: followingUserId,
      },
    });
    return { message: 'Followed successfully' };
  }

  @MessagePattern('unfollow')
  async unfollow(@Payload() data) {
    const userId = +data.userId;
    const followingUserId = +data.followingUserId;
    const isFollowing = await this.prisma.follow_list.findFirst({
      where: {
        user_id: userId,
        follow_user_id: followingUserId,
      },
    });

    if (!isFollowing)
      throw new RpcException({
        status: 400,
        message: 'Not following',
      });

    await this.prisma.follow_list.delete({
      where: {
        id: isFollowing.id,
      },
    });
    return { message: 'Unfollowed successfully' };
  }
}
