import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producers/producer.service';
import { CreateMessageDto, DeleteMessageDto, DtoChecker, EchoEvent, KafkaEvent, UpdateMessageDto } from '@tellme/shared';
import { BaseWebsocketHandler } from '@tellme/common';


@Injectable()
export class MessageWebsocketHandlers extends BaseWebsocketHandler {
  // Override the default events

  constructor(
    private readonly producerService: ProducerService,
    private readonly dtoChecker: DtoChecker
  ) {
    super();
    // this.createEvent = EchoEvent.MessageCreate;
    // this.updateEvent = EchoEvent.MessageUpdate;
    // this.deleteEvent = EchoEvent.MessageDelete;
  }

  /**
   * Implements the `create` method for Message creation.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param message - The data required to create the message.
   */
  async create(server: Server, client: Socket, messageDto: CreateMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, CreateMessageDto, messageDto)) {
      return ;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageCreate, messageDto);
  }

  /**
   * Implements the `update` method for message updates.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param messageDto - The data required to update the message.
   */
  async update(server: Server, client: Socket, messageDto: UpdateMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, UpdateMessageDto, messageDto)) {
      return ;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageUpdate, messageDto); 
  }

  /**
   * Implements the `delete` method for message deletion.
   * @param server - The WebSocket server instance.
   * @param client - The client socket making the request.
   * @param messageDto - The data required to delete the message.
   */
  async delete(server: Server, client: Socket, messageDto: DeleteMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, DeleteMessageDto, messageDto)) {
      return ;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageDelete, messageDto); 
  }

}