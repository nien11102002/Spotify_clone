import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TUser } from 'src/common/types/types';
import { PostgresqlPrismaService } from 'src/prisma/postgresql.prisma/postgresql.prisma.service';

interface TypeMessage {
  idSender: number;
  contentMess: string;
  timeSend: Date;
  roomChat: string;
}

@WebSocketGateway({ path: '/socket' })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PostgresqlPrismaService,
    @Inject('MESSAGE_NAME') private messageService: ClientProxy,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user: TUser = await this.prisma.users.findUnique({
        where: { id: Number(payload.user_id) },
        select: {
          account: true,
          id: true,
          name: true,
          avatar: true,
          banner: true,
          description: true,
          refresh_token: true,
          role: true,
        },
      });

      (client as any).user = user;
      console.log('Client connected', { userId: user.id });
    } catch (err) {
      console.log('Invalid token');
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() body: TypeMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    client.rooms.forEach((roomId) => {
      client.leave(roomId);
    });
    client.join(body.roomChat);

    client.to(body.roomChat).emit('message', body);

    this.messageService.emit('new-message', { body });
  }

  // @SubscribeMessage('new-comment')
  // handleNewComment(
  //   @MessageBody() payload: { songId: string; comment: string },
  //   @ConnectedSocket() client: Socket,
  // ): void {
  //   const { songId, comment } = payload;
  //   this.server.to(songId).emit('new-comment', comment);
  // }
}
