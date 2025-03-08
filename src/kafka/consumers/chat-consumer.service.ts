import { Inject, Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AbstractKafkaConsumer } from '@tellme/common';
import { MessageCreateKafkaHandler } from 'src/websocket/handlers/message/message-create-kafka-handler.service';

@Injectable()
export class ChatConsumerService extends AbstractKafkaConsumer {
  
  constructor(
    private readonly messageCreateKafkaHandler: MessageCreateKafkaHandler,
    @Inject('KAFKA_CLIENT') protected readonly kafka: Kafka
    
  ) {
    super(kafka, 'chat-consumer-group');
    this.subscribeToHandler(messageCreateKafkaHandler);
    this.run();
  }
}