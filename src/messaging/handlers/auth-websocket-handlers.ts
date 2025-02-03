import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BaseWebsocketHandler } from './base-websocket-handler.abstract';

@Injectable()
export class AuthWebsocketHandlers extends BaseWebsocketHandler {
  // Override the default events
  protected createEvent = { name: 'channel:create' };
  protected updateEvent = { name: 'channel:update' };
  protected deleteEvent = { name: 'channel:delete' };
  protected putEvent = { name: 'channel:replace' };

  constructor() {
    super();
  }

  /**
   * Implements the `create` method for resource creation.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to create the resource.
   */
  create(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.createEvent.name, { id: '123', ...payload });
  }

  /**
   * Implements the `update` method for resource updates.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  update(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.updateEvent.name, { id: '123', ...payload });
  }

  /**
   * Implements the `delete` method for resource deletion.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  delete(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.deleteEvent.name, { id: payload.channelId });
  }

  /**
   * Implements the `put` method for resource replacement.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to replace the resource.
   */
  put(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.putEvent.name, { id: '123', ...payload });
  }
}