import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // В продакшене укажите URL фронтенда
  namespace: 'admin', // Отдельный канал для админов
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Здесь можно проверить токен админа через client.handshake.auth.token
    console.log(`Admin connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Admin disconnected: ${client.id}`);
  }

  // Метод, который мы будем вызывать из сервисов
  sendTransaction(data: any) {
    this.server.emit('new_transaction', data);
  }

  // Новый метод для обновлений
  sendTransactionUpdate(data: any) {
    this.server.to('admins').emit('transaction_update', data);
  }
}
