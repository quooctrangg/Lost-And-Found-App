import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: true
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly prismaService: PrismaService) { }

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
  sendMessage(@MessageBody() dataBody: any) {
    try {
      const { userRecievedId, data } = dataBody
      this.server.to(userRecievedId).emit('message recieved', data);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('new image')
  async sendImage(@MessageBody() dataBody: any) {
    try {
      const { userRecievedId, data } = dataBody
      this.server.to(userRecievedId).emit('image recieved', data);
    } catch (error) {
      console.log(error);
    }
  }
}
