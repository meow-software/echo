import { Injectable } from "@nestjs/common";
import { KAFKA_EVENT, KafkaEventHandler } from "../kafka.event";
import { CreateMessageDto } from "src/messaging/dto/message/createMessageDto";
import { MessageWebsocketHandlers } from "src/messaging/handlers/message-websocket-handlers";

@Injectable()
export class MessageCreateHandler implements KafkaEventHandler {
  eventType: KAFKA_EVENT = KAFKA_EVENT.MessageCreate;
  constructor(
    private readonly websocketHandler: MessageWebsocketHandlers
  ) { }
  handleEvent(message: CreateMessageDto): void {
    console.log('Message reçu de Kafka:', message); 
    this.websocketHandler.emitToRoom(message.channelId, this.eventType, message);
  }
}