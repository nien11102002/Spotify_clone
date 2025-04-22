import { Controller, Get, Inject, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';

@Controller('messages')
export class MessageController {
  constructor(@Inject('MESSAGE_NAME') private messageService: ClientProxy) {}

  @Get('byRoom')
  async getMessagesByRoom(@Query('roomChat') roomChat: string) {
    console.log('roomChat', roomChat);
    const messageList = await lastValueFrom(
      this.messageService
        .send('get-message', { roomChat })
        .pipe(handleRpcError()),
    );

    return messageList;
  }
}
