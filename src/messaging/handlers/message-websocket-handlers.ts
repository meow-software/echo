import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common'; 
import { BaseWebsocketHandler } from './base-websocket-handler.abstract';
import { EchoEvent } from '../echo-event';

@Injectable()
export class MessageWebsocketHandlers extends BaseWebsocketHandler {
  // Override the default events

  constructor() {
    super();
    this.createEvent = EchoEvent.MessageCreate;
    this.updateEvent = EchoEvent.MessageUpdate;
    this.deleteEvent = EchoEvent.MessageDelete;
  }

  /**
   * Implements the `create` method for resource creation.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to create the resource.
   */
  create(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.createEvent as string, { id: '123', ...payload });
  }

  /**
   * Implements the `update` method for resource updates.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  update(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.updateEvent as string, { id: '123', ...payload });
  }

  /**
   * Implements the `delete` method for resource deletion.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  delete(server: Server, client: Socket, payload: any): void {
    this.emitToClient(client, this.deleteEvent as string, { id: payload.channelId });
  }

}