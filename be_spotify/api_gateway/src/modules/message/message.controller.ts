import { Controller, Get, Inject, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(
    @Inject('MESSAGE_NAME') private messageService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('byRoom')
  async getMessagesByRoom(@Query('roomChat') roomChat: string) {
    console.log('API getMessagesByRoom called', { roomChat });

    const cacheKey = `message_${roomChat}`;
    const cachedMessages = await this.cacheManager.get(cacheKey);
    if (cachedMessages) return cachedMessages;

    const messageList = await lastValueFrom(
      this.messageService
        .send('get-message', { roomChat })
        .pipe(handleRpcError()),
    );

    if (messageList) {
      this.cacheManager.set(cacheKey, messageList, 5 * 60);
    }

    return messageList;
  }
}
