import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { IEvent } from './event.interface';

/**
 * Abstract base class for WebSocket handlers.
 * Provides common functionality and enforces a consistent structure for all handlers.
 */
@Injectable()
export abstract class BaseWebsocketHandler {
  /**
   * Event for resource creation.
   */
  protected createEvent: IEvent = { name: 'create' };

  /**
   * Event for resource updates.
   */
  protected updateEvent: IEvent = { name: 'update' };

  /**
   * Event for resource deletion.
   */
  protected deleteEvent: IEvent = { name: 'delete' };

  /**
   * Event for resource replacement (PUT).
   */
  protected putEvent: IEvent = { name: 'put' };

  /**
   * Registers WebSocket event handlers.
   * This implementation automatically maps events to their corresponding methods.
   * @param server - The WebSocket server instance.
   */
  registerHandlers(server: Server): void {
    server.on('connection', (client: Socket) => {
      // Automatically register event listeners based on the defined events
      if (this.createEvent) {
        client.on(this.createEvent.name, (payload: any) => this.create(server, client, payload));
      }

      if (this.updateEvent) {
        client.on(this.updateEvent.name, (payload: any) => this.update(server, client, payload));
      }

      if (this.deleteEvent) {
        client.on(this.deleteEvent.name, (payload: any) => this.delete(server, client, payload));
      }

      if (this.putEvent) {
        client.on(this.putEvent.name, (payload: any) => this.put(server, client, payload));
      }

    });
  }

  /**
   * Emits an event to all connected clients.
   * @param server - The WebSocket server instance.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  protected emitToAll(server: Server, event: string, payload: any): void {
    server.emit(event, payload);
  }

  /**
   * Emits an event to a specific client.
   * @param client - The target client socket.
   * @param event - The event name to emit.
   * @param payload - The data to send with the event.
   */
  protected emitToClient(client: Socket, event: string, payload: any): void {
    client.emit(event, payload);
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

  /**
   * Abstract method for handling resource replacement (PUT).
   * Must be implemented by child classes.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to replace the resource.
   */
  abstract put(server: Server, client: Socket, payload: any): void;
}