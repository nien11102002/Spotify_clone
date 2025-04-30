import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('find-discuss')
  async findDiscuss(@Payload() data) {
    const id = +data.id;
    const discuss = await this.prisma.comments.findMany({
      where: {
        song_id: id,
      },
      include: {
        users: true,
      },
      orderBy: {
        discuss_date: 'desc',
      },
    });

    const formatResult = discuss.map((item) => {
      return {
        userId: item.user_id,
        discussId: item.id,
        content: item.content,
        songId: item.song_id,
        discussDate: item.discuss_date,
        replyDiscussId: item.reply_discuss_id,
        User: {
          userId: item.users.id,
          name: item.users.name,
          nationality: item.users.nationality,
          channelName: item.users.channel_name,
          avatar: item.users.avatar,
          description: item.users.description,
          banner: item.users.banner,
          role: item.users.role,
        },
      };
    });

    return formatResult;
  }

  @EventPattern('new-comment')
  async handleNewComment(@Payload() data) {
    console.log('API new-comment called', { data });
    const { userId, content, songId, discussDate, replyDiscussId } =
      data.payload;

    if (!content || !userId || !songId || !discussDate) {
      throw new RpcException({
        statusCode: 400,
        message: 'Missing required fields',
      });
    }

    const existSong = await this.prisma.songs.findUnique({
      where: { id: songId },
    });
    if (!existSong) {
      throw new RpcException({
        statusCode: 400,
        message: 'Song not found',
      });
    }

    const existUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!existUser) {
      throw new RpcException({
        statusCode: 400,
        message: 'User not found',
      });
    }

    const newComment = await this.prisma.comments.create({
      data: {
        user_id: userId,
        content: content,
        song_id: songId,
        discuss_date: discussDate,
        reply_discuss_id: replyDiscussId,
      },
      include: {
        users: true,
      },
    });

    const formatResult = {
      userId: newComment.user_id,
      discussId: newComment.id,
      content: newComment.content,
      songId: newComment.song_id,
      discussDate: newComment.discuss_date,
      replyDiscussId: newComment.reply_discuss_id,
      User: {
        userId: newComment.users.id,
        name: newComment.users.name,
        nationality: newComment.users.nationality,
        channelName: newComment.users.channel_name,
        avatar: newComment.users.avatar,
        description: newComment.users.description,
        banner: newComment.users.banner,
        role: newComment.users.role,
      },
    };

    return formatResult;
  }
}
