import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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

  @EventPattern('new-message')
  async newMessage(@Payload() data: any) {
    const { idSender, contentMess, roomChat, timeSend } = data.body;
    const message = await this.prisma.messages.create({
      data: {
        sender_id: idSender,
        message: contentMess,
        room_chat: roomChat,
      },
    });
    return message;
  }
}
