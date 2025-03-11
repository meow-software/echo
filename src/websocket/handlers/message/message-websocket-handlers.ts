import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producers/producer.service';
import { CreateMessageDto, DeleteMessageDto, DtoChecker, EchoEvent, KafkaEvent, UpdateMessageDto } from '@tellme/shared';
import { BaseWebsocketHandler, OnWebsocketEventHandler } from '@tellme/common';


@Injectable()
export class MessageWebsocketHandlers extends BaseWebsocketHandler {

  constructor(
    private readonly producerService: ProducerService,
    private readonly dtoChecker: DtoChecker
  ) {
    super();
  }

  /**
   * Handles message creation event.
   * 
   * @param {Server} _server - The WebSocket server instance.
   * @param {Socket} client - The client socket initiating the event.
   * @param {CreateMessageDto} messageDto - The message data transfer object.
   * @returns {Promise<void>}
   */
  @OnWebsocketEventHandler(EchoEvent.MessageCreate)
  async create(_server: Server, client: Socket, messageDto: CreateMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, CreateMessageDto, messageDto)) {
      return;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageCreate, messageDto);
  }


  /**
   * Handles message update event.
   * 
   * @param {Server} _server - The WebSocket server instance.
   * @param {Socket} client - The client socket initiating the event.
   * @param {UpdateMessageDto} messageDto - The updated message data transfer object.
   * @returns {Promise<void>}
   */
  @OnWebsocketEventHandler(EchoEvent.MessageUpdate)
  async update(_server: Server, client: Socket, messageDto: UpdateMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, UpdateMessageDto, messageDto)) {
      return;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageUpdate, messageDto);
  }

  /**
   * Handles message deletion event.
   * 
   * @param {Server} _server - The WebSocket server instance.
   * @param {Socket} client - The client socket initiating the event.
   * @param {DeleteMessageDto} messageDto - The message data transfer object for deletion.
   * @returns {Promise<void>}
   */
  @OnWebsocketEventHandler(EchoEvent.MessageDelete)
  async delete(_server: Server, client: Socket, messageDto: DeleteMessageDto) {
    if (await this.dtoChecker.checkAndEmitErrors(client, DeleteMessageDto, messageDto)) {
      return;
    }
    // Send Kafka for treatment
    await this.producerService.send(KafkaEvent.MessageDelete, messageDto);
  }

}