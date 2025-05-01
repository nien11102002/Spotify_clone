import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheModule } from '../redis_cache/redis_cache.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PLAYLIST_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'playlist_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RedisCacheModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
