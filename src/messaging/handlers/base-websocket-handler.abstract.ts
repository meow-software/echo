import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { EchoEvent } from '../echo-event';

/**
 * Abstract base class for WebSocket handlers.
 * Provides common functionality and enforces a consistent structure for all handlers.
 */
@Injectable()
export abstract class BaseWebsocketHandler {
  /**
   * Event for resource creation.
   */
  protected createEvent: EchoEvent;

  /**
   * Event for resource updates.
   */
  protected updateEvent: EchoEvent;

  /**
   * Event for resource deletion.
   */
  protected deleteEvent: EchoEvent;

  protected server: Server;
  

  /**
   * Registers WebSocket event handlers.
   * This implementation automatically maps events to their corresponding methods.
   * @param server - The WebSocket server instance.
   */
  registerHandlers(server: Server): void {
    this.server = server;
    server.on('connection', (client: Socket) => {
      // Automatically register event listeners based on the defined events
      if (this.createEvent) {
        client.on(this.createEvent as string, (payload: any) => this.create(server, client, payload));
      }

      if (this.updateEvent) {
        client.on(this.updateEvent as string, (payload: any) => this.update(server, client, payload));
      }

      if (this.deleteEvent) {
        client.on(this.deleteEvent as string, (payload: any) => this.delete(server, client, payload));
      }

    });
  }

  /**
   * Emits an event to all connected clients.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToAll(event: EchoEvent, payload: any): void {
    this.server.emit(event as string, payload);
  }
  /**
   * Emits an event to all clients in a specific WebSocket room.
   * If the room does not exist or has no connected clients, the event will not be sent to anyone.
   * 
   * @param room - The name of the room to which the event should be sent.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToRoom(room: string, event: EchoEvent, payload: any): void {
    this.server.to(room).emit(event as string, payload);
  }

  /**
   * Emits an event to a specific client.
   * @param client - The target client socket.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  public emitToClient(client: Socket, event: EchoEvent, payload: any): void {
    client.emit(event as string, payload);
  }

  /**
   * Abstract method for handling resource creation.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to create the resource.
   */
  abstract create(server: Server, client: Socket, payload: any): void;

  /**
   * Abstract method for handling resource updates.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  abstract update(server: Server, client: Socket, payload: any): void;

  /**
   * Abstract method for handling resource deletion.
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  abstract delete(server: Server, client: Socket, payload: any): void;
}