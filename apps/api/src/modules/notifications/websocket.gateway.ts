import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<string, string[]> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    for (const [userId, socketIds] of this.userSockets.entries()) {
      const filtered = socketIds.filter((id) => id !== client.id);
      if (filtered.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, filtered);
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    const existingSockets = this.userSockets.get(data.userId) || [];
    existingSockets.push(client.id);
    this.userSockets.set(data.userId, existingSockets);

    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);
    client.emit('registered', { success: true });
  }

  sendToUser(userId: string, event: string, data: any) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds && socketIds.length > 0) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
      this.logger.log(`Sent event '${event}' to user ${userId}`);
    }
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Broadcasted event '${event}' to all clients`);
  }

  sendToCompany(companyId: string, event: string, data: any) {
    this.server.to(`company:${companyId}`).emit(event, data);
    this.logger.log(`Sent event '${event}' to company ${companyId}`);
  }

  @SubscribeMessage('joinCompany')
  handleJoinCompany(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { companyId: string },
  ) {
    client.join(`company:${data.companyId}`);
    this.logger.log(`Socket ${client.id} joined company ${data.companyId}`);
    client.emit('joinedCompany', { success: true, companyId: data.companyId });
  }

  @SubscribeMessage('leaveCompany')
  handleLeaveCompany(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { companyId: string },
  ) {
    client.leave(`company:${data.companyId}`);
    this.logger.log(`Socket ${client.id} left company ${data.companyId}`);
    client.emit('leftCompany', { success: true, companyId: data.companyId });
  }
}
