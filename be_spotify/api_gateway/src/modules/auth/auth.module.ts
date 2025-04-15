import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PostgresqlPrismaService } from 'src/prisma/postgresql.prisma/postgresql.prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MysqlPrismaService } from 'src/prisma/mysql.prisma/mysql.prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_NAME',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:1234@localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PostgresqlPrismaService,
    JwtService,
    JwtStrategy,
    MysqlPrismaService,
  ],
})
export class AuthModule {}
