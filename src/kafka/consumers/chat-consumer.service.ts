import { Inject, Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AbstractKafkaConsumer } from '@tellme/common';
import { MessageKafkaEventHandler } from 'src/websocket/handlers/message/message-kafka-event-handler.service';

@Injectable()
export class ChatConsumerService extends AbstractKafkaConsumer {
  
  constructor(
    private readonly messageKafkaEventHandler: MessageKafkaEventHandler,
    @Inject('KAFKA_CLIENT') protected readonly kafka: Kafka,
    
  ) {
    super(kafka, 'chat-consumer-group');
    this.registerEventHandlers(messageKafkaEventHandler);
    this.run();
  }
}