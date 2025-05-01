import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MysqlPrismaService } from 'src/prisma/mysql.prisma/mysql.prisma.service';
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
  providers: [
    SocketGateway,
    SocketService,
    JwtService,
    JwtStrategy,
    MysqlPrismaService,
  ],
})
export class SocketModule {}
