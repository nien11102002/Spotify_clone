import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SONG_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'song_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RedisCacheModule,
  ],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
