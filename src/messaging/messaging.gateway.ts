import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BaseWebsocketHandler } from './handlers/base-websocket-handler.abstract';
import { AuthWebsocketHandlers } from './handlers/auth-websocket-handlers';
import { MessageWebsocketHandlers } from './handlers/message-websocket-handlers';


@WebSocketGateway({
  cors: {
    origin: '*', // Adjust according to your configuration
  },
})
export class MessagingGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  private handlers: BaseWebsocketHandler[];

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