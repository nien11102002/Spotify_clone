import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('get-message')
  async getMessage(@Payload() data: any) {
    const { roomChat } = data;
    console.log('roomChat', roomChat);
    const messageList = await this.prisma.messages.findMany({
      where: {
        room_chat: roomChat,
      },
      orderBy: { created_at: 'desc' },
    });
    return messageList;
  }
}
