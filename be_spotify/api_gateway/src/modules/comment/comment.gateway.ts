import { Inject } from '@nestjs/common';
import { ClientProvider, ClientProxy } from '@nestjs/microservices';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ path: '/comment/socket', namespace: 'comment' })
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  constructor(@Inject('COMMENT_NAME') private commentService: ClientProxy) {}

  @SubscribeMessage('join-song')
  handleJoinSong(
    @MessageBody() songId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(songId);
    console.log(`Client ${client.id} joined room ${songId}`);
  }

  @SubscribeMessage('new-comment')
  handleNewComment(
    @MessageBody() payload: { songId: string; comment: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { songId, comment } = payload;
    this.server.to(songId).emit('new-comment', comment);
  }
}
