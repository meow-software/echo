import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IKafkaEventHandler, RedisClientService } from "@tellme/common";
import { CreateMessageDto, KafkaEvent } from "@tellme/shared";
import { ChatConsumerService } from "src/kafka/consumers/chat-consumer.service";
import { MessageWebsocketHandlers } from "src/websocket/handlers/message/message-websocket-handlers";

@Injectable()
export class MessageCreateKafkaHandler implements IKafkaEventHandler {
  eventType: string = KafkaEvent.MessageCreate as string;
  TTL : number = 3600;
  constructor(
    private readonly websocketHandler: MessageWebsocketHandlers,
    private readonly redisClientService: RedisClientService,
    private readonly commandBus: CommandBus,
  ) {
   }
  async handleEvent(message: CreateMessageDto): Promise<void> {
    console.log('Message reçu de Kafka:', message); 
    
    // TODO: mettre les cles redis dans tellme 
    // await this.redisClientService.set(`${this.REDIS_CACHE_SOCKET_CONNECTED}${client.id}`, userId, this.TTL);

    // Enregistrer le message en base de données via CQRS
    // await this.commandBus.execute(new CreateMessageCommand(message));
    this.websocketHandler.emitToRoom(message.channelId, this.eventType, message);
  }
}