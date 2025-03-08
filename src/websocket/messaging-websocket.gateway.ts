import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWebsocketHandlers } from './handlers/auth/auth-websocket-handlers';
import { MessageWebsocketHandlers } from './handlers/message/message-websocket-handlers';
import { IBaseWebsocketHandler } from '@tellme/common';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  private handlers: IBaseWebsocketHandler[];

  constructor(
    private readonly authWebsocketHandlers: AuthWebsocketHandlers,
    private readonly messageWebsocketHandlers: MessageWebsocketHandlers,
    // Inject other handlers
  ) {
    this.handlers = [];
    this.handlers.push(authWebsocketHandlers);
    this.handlers.push(messageWebsocketHandlers);
  }

  afterInit(): void {
    // Register handlers for each module
    this.handlers.forEach(handler => {
      handler.registerHandlers(this.server);
    });
  }
}