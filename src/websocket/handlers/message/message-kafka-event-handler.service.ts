import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IKafkaEventHandler, RedisClientService, OnKafkaEventHandler } from "@tellme/common";
import { CreateMessageDto, KafkaEvent, UpdateMessageDto } from "@tellme/shared";
import { MessageWebsocketHandlers } from "src/websocket/handlers/message/message-websocket-handlers";
import { CreateMessageCommand } from "./commands/create-message.command";

@Injectable()
export class MessageKafkaEventHandler implements IKafkaEventHandler {
  constructor(
    private readonly websocketHandler: MessageWebsocketHandlers,
    private readonly redisClientService: RedisClientService,
    private readonly commandBus: CommandBus,
  ) { }

  /**
 * Handle Kafka event: MessageCreate 
 */
  @OnKafkaEventHandler(KafkaEvent.MessageCreate)
  async handleCreate(message: CreateMessageDto) {
    console.log('Processing MessageCreate event:', message);
    console.log('Message reçu de Kafka:', message); 
    // Enregistrer le message en base de données via CQRS
    await this.commandBus.execute(new CreateMessageCommand(message));

    // TODO: mettre les cles redis dans tellme 
    // await this.redisClientService.set(`${this.REDIS_CACHE_SOCKET_CONNECTED}${client.id}`, userId, this.TTL);
    await this.redisClientService.getIoRedis();
    // Send the message to the room
    this.websocketHandler.emitToRoom(message.channelId, KafkaEvent.MessageCreate, message);
    // Business logic for message creation
  }

  /**
   * Handle Kafka event: MessageUpdate
   */
  @OnKafkaEventHandler(KafkaEvent.MessageUpdate)
  async handleUpdate(message: UpdateMessageDto) {
    console.log('Processing MessageUpdate event:', message);
    // Business logic for message update 
  }
  
}