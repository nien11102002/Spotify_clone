import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

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
    });

    const formatResult = discuss.map((item) => {
      return {
        userId: item.user_id,
        discussId: item.id,
        content: item.content,
        songId: item.song_id,
        discussData: item.discuss_date,
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
}
