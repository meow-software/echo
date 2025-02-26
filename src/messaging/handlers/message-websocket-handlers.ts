import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BaseWebsocketHandler } from './base-websocket-handler.abstract';
import { EchoEvent } from '../echo-event';
import { ChatProducerService } from 'src/kafka/producers/chat.producer.service';
import { DtoChecker } from 'src/dto-checker/dto-checker.service';
import { CreateMessageDto } from '../dto/message/createMessageDto';


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
   * Implements the `create` method for Message creation.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param message - The data required to create the message.
   */
  async create(server: Server, client: Socket, messageDto: CreateMessageDto): Promise<void> {
    // const message = {
    //   senderId: messageDto.senderId,
    //   channelId: messageDto.channelId,
    //   content: messageDto.content,
    //   createdAt: new Date(),
    // };
    if (await this.dtoChecker.checkAndEmitErrors(client, CreateMessageDto, messageDto)) {
      return ;
    }
    // Send Kafka for treatment
    await this.chatProducerService.send(messageDto);
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