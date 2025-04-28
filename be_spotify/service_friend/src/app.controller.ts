import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @EventPattern('add-friend')
  async addFriend(@Payload() data) {
    const { userId, friendId, roomChat } = data;
    console.log({ userId, friendId, roomChat });

    const existingFriendship = await this.prisma.friend_list.findFirst({
      where: {
        OR: [
          { user_id: userId, friend_id: friendId },
          { user_id: friendId, friend_id: userId },
        ],
      },
    });

    if (existingFriendship) {
      throw new RpcException({
        statusCode: 400,
        message: 'Friendship already exists',
      });
    }

    await this.prisma.friend_list.createMany({
      data: [
        {
          user_id: userId,
          friend_id: friendId,
          room_chat: roomChat,
        },
        {
          user_id: friendId,
          friend_id: userId,
          room_chat: roomChat,
        },
      ],
    });
  }

  @EventPattern('delete-friend')
  async deleteFriend(@Payload() data) {
    const friendId = +data.friendId;
    console.log({ friendId });

    const friendship = await this.prisma.friend_list.findFirst({
      where: {
        OR: [{ user_id: friendId }, { friend_id: friendId }],
      },
    });

    if (!friendship) {
      throw new RpcException({
        statusCode: 404,
        message: 'Friendship not found',
      });
    }

    await this.prisma.friend_list.deleteMany({
      where: {
        OR: [{ user_id: friendId }, { friend_id: friendId }],
      },
    });
  }

  @MessagePattern('get-list-friend')
  async getListFriend(@Payload() data) {
    const userId = +data.id;
    console.log({ userId });

    if (!userId) {
      throw new RpcException({
        statusCode: 400,
        message: 'User ID is required',
      });
    }

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const friends = await this.prisma.friend_list.findMany({
      where: {
        user_id: userId,
      },
      include: {
        users_friend_list_friend_idTousers: true,
      },
    });

    return friends.map((friend) => ({
      id: friend.id,
      userId: friend.user_id,
      friendId: friend.friend_id,
      roomChat: friend.room_chat,
      User_ListFriends_friendIdToUser: {
        userId: friend.users_friend_list_friend_idTousers.id,
        name: friend.users_friend_list_friend_idTousers.name,
        nationality: friend.users_friend_list_friend_idTousers.nationality,
        chanelName: friend.users_friend_list_friend_idTousers.channel_name,
        avatar: friend.users_friend_list_friend_idTousers.avatar,
        description: friend.users_friend_list_friend_idTousers.description,
        banner: friend.users_friend_list_friend_idTousers.banner,
        role: friend.users_friend_list_friend_idTousers.role,
      },
    }));
  }
}
