import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer() server: Server

  afterInit(socket: Socket) { }

  handleConnection(socket: Socket) {
    console.log('connect', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('disconnect', socket.id);
  }

  @SubscribeMessage('setup')
  hanleSetup(@ConnectedSocket() socket: Socket, @MessageBody() data: { userId: string }): void {
    this.server.in(socket.id).socketsJoin(data.userId)
  }

  @SubscribeMessage('new message')
  handleMessage(@MessageBody() data: { userId: string, message: string }): void {
    this.server.to(data.userId).emit('message', { data: data.message });
  }

}
