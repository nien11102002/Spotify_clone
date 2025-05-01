import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMENT_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@some-rabbit:5672'],
          queue: 'comment_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RedisCacheModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
