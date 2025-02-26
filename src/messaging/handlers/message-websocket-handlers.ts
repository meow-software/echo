import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BaseWebsocketHandler } from './base-websocket-handler.abstract';
import { EchoEvent } from '../echo-event';
import { KAFKA_TOPIC } from 'src/kafka/kafka.topic';
import { ChatProducerService } from 'src/kafka/producers/chat.producer.service';

import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { DtoChecker } from 'src/dto-checker/dto-checker.service';

export class MessageDTO {
  /**
   * The ID of the sender (user).
   */
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  /**
   * The ID of the channel where the message is sent.
   */
  @IsUUID()
  @IsNotEmpty()
  channelId: string;

  /**
   * The content of the message.
   */
  @IsString()
  @IsNotEmpty()
  content: string;
}


@Injectable()
export class MessageWebsocketHandlers extends BaseWebsocketHandler {
  // Override the default events

  constructor(
    private readonly chatProducerService: ChatProducerService,
    private readonly dtoChecker: DtoChecker
  ) {
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
  async create(server: Server, client: Socket, payload: any): Promise<void> {
    // verifier les dto de payload
    let a  = await this.dtoChecker.check(MessageDTO, payload);
    console.log(a);
    const message = {
      senderId: payload.userId,
      channelId: payload.channelId,
      content: payload.content,
      createdAt: new Date(),
    };

    // Envoyer le message dans Kafka
    await this.chatProducerService.send(message);
  }

  /**
   * Implements the `update` method for resource updates.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to update the resource.
   */
  update(server: Server, client: Socket, payload: any): void {

  }

  /**
   * Implements the `delete` method for resource deletion.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param payload - The data required to delete the resource.
   */
  delete(server: Server, client: Socket, payload: any): void {

  }

}