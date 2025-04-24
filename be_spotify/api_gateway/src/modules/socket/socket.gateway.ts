import { Inject } from '@nestjs/common';
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
import { MysqlPrismaService } from 'src/prisma/mysql.prisma/mysql.prisma.service';

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
    private prisma: MysqlPrismaService,
    @Inject('MESSAGE_NAME') private messageService: ClientProxy,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const payload = this.jwtService.verify(token);
      (client as any).user = payload;
    } catch (err) {
      console.log('Invalid token');
      client.disconnect();
    }
  }

  // @SubscribeMessage('join-room-message')
  // handleJoinRoomMessage(
  //   @MessageBody() body: any,
  //   @ConnectedSocket() client: Socket,
  // ): void {
  //   client.join(body);
  //   console.log(`Client ${client.id} joined room `);
  // }
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() body: TypeMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    client.rooms.forEach((roomId) => {
      client.leave(roomId);
    });
    client.join(body.roomChat);

    client.to(body.roomChat).emit('message', { message: body });

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
