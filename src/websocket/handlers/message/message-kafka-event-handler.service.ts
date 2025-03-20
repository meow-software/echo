import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IKafkaEventHandler, RedisClientService, OnKafkaEventHandler } from "@tellme/common";

import { CreateMessageDto, DeleteMessageDto, KafkaEvent, MessageCacheService, MessageEntity, UpdateMessageDto } from "@tellme/shared";
import { MessageWebsocketHandlers } from "src/websocket/handlers/message/message-websocket-handlers";
import { CreateMessageCommand } from "./commands/create-message.command";
import { UpdateMessageCommand } from "./commands/update-message.command";
import { DeleteMessageCommand } from "./commands/delete-message.command";

@Injectable()
export class MessageKafkaEventHandler implements IKafkaEventHandler {
  constructor(
    private readonly websocketHandler: MessageWebsocketHandlers,
    private readonly redisClientService: RedisClientService,
    private readonly messageCacheService: MessageCacheService,
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
    const messageEntity: MessageEntity = await this.commandBus.execute(new CreateMessageCommand(message));
    // Send the message to the room
    this.websocketHandler.emitToRoom(message.channelId, KafkaEvent.MessageCreate, messageEntity);
  }

  
  /**
   * Handle Kafka event: MessageUpdate
   */
  @OnKafkaEventHandler(KafkaEvent.MessageUpdate)
  async handleUpdate(message: UpdateMessageDto) {
    console.log('Processing MessageUpdate event:', message);
    // Enregistrer le message en base de données via CQRS
    const messageEntity: MessageEntity = await this.commandBus.execute(new UpdateMessageCommand(message));
    // Send the message to the room
    this.websocketHandler.emitToRoom(message.channelId, KafkaEvent.MessageUpdate, messageEntity);
  }
  

  /**
   * Handle Kafka event: MessageDelete
   */
  @OnKafkaEventHandler(KafkaEvent.MessageDelete)
  async handleDelete(message: DeleteMessageDto) {
    console.log('Processing MessageDelete event:', message);
    // Enregistrer le message en base de données via CQRS
    const messageEntity: MessageEntity = await this.commandBus.execute(new DeleteMessageCommand(message));
    // Send the message to the room
    this.websocketHandler.emitToRoom(message.channelId, KafkaEvent.MessageDelete, messageEntity);
  }
  
}