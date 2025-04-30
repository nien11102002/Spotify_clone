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
import { lastValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { TUser } from 'src/common/types/types';
import { PostgresqlPrismaService } from 'src/prisma/postgresql.prisma/postgresql.prisma.service';
import { TypeComment } from './TypeComment';

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
    @Inject('COMMENT_NAME') private commentService: ClientProxy,
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
      // console.log('Client connected', { userId: user.id });
    } catch (err) {
      // console.log('Invalid token');
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() body: TypeMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(
      `Client ${client.id} is connected to the room: ${body.roomChat}`,
    );
    client.rooms.forEach((roomId) => {
      client.leave(roomId);
    });
    client.join(body.roomChat);

    this.server.to(body.roomChat).emit('message', body);

    this.messageService.emit('new-message', { body });
  }

  @SubscribeMessage('comment')
  async handleNewComment(
    @MessageBody() payload: TypeComment,
    @ConnectedSocket() client: Socket,
  ) {
    const { songId } = payload;
    console.log(
      `Client ${client.id} is connected to the Song comment: ${payload.songId}`,
    );
    client.rooms.forEach((room) => {
      client.leave(room);
    });
    client.join(String(songId));
    console.log({ client });

    const newComment = await lastValueFrom(
      this.commentService.send('new-comment', { payload }),
    );

    console.log('New comment created', { newComment });

    this.server.to(String(songId)).emit('comment', newComment);
  }
}
