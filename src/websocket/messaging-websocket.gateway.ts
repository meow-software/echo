import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWebsocketHandlers } from './handlers/auth/auth-websocket-handlers';
import { MessageWebsocketHandlers } from './handlers/message/message-websocket-handlers';
import { IBaseWebsocketHandler,EchoWebsocketGateway } from '@tellme/common';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateway extends EchoWebsocketGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  private websocketHandlers: IBaseWebsocketHandler[] = [];

  constructor(
    private readonly authWebsocketHandlers: AuthWebsocketHandlers,
    private readonly messageWebsocketHandlers: MessageWebsocketHandlers,
    // Inject other handlers
  ) {
    super();
    this.setServer(this.server);
    this.websocketHandlers.push(authWebsocketHandlers);
    this.websocketHandlers.push(messageWebsocketHandlers);
  }

  afterInit(): void {
    // Register handlers for each module
    while (this.websocketHandlers.length > 0) {
      const handler = this.websocketHandlers.shift(); // remove first element
      if (handler) {
        this.registerEventHandlers(handler);
      }
    }
    this.listen();
  }
}