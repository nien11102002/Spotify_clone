import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'message_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RedisCacheModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
