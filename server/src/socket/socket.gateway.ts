import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: true
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(SocketGateway.name);


    @WebSocketServer() server: Server

    afterInit(socket: Socket) { }

    handleConnection(socket: Socket) {
        this.logger.log('connect ' + socket.id)
    }

    handleDisconnect(socket: Socket) {
        this.logger.log('disconnect ' + socket.id)
    }

    @SubscribeMessage('setup')
    hanleSetup(@ConnectedSocket() socket: Socket, @MessageBody() data: { userId: string }): void {
        this.server.in(socket.id).socketsJoin(data.userId)
        this.logger.log('join room: ' + data.userId)
    }

    @SubscribeMessage('new message')
    sendMessage(@MessageBody() dataBody: any) {
        try {
            const { userRecievedId, data } = dataBody
            this.server.to(userRecievedId).emit('message recieved', data);
        } catch (error) {
            this.logger.error(error.message)
        }
    }

    @SubscribeMessage('new image')
    async sendImage(@MessageBody() dataBody: any) {
        try {
            const { userRecievedId, data } = dataBody
            this.server.to(userRecievedId).emit('image recieved', data);
        } catch (error) {
            this.logger.error(error.message)
        }
    }

    @SubscribeMessage('new notification')
    async sendNotification(@MessageBody() dataBody: any) {
        try {
            const { postId, parentId } = dataBody
            let room: any = null
            if (parentId) {
                const comment = await this.prismaService.comment.findUnique({
                    where: {
                        id: Number(parentId)
                    }
                })
                room = comment.userId
            } else {
                const post = await this.prismaService.post.findUnique({
                    where: {
                        id: Number(postId)
                    }
                })
                room = post.userId
            }
            this.server.to(room).emit('notification recieved');
        } catch (error) {
            this.logger.error(error.message)
        }
    }
}
