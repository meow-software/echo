import { Inject, Injectable } from '@nestjs/common';
import { KafkaConsumer } from '../kafka-consumer.abstract';
import { Kafka } from 'kafkajs';
import { MessageCreateHandler } from '../handler/message-create-handler.service';

@Injectable()
export class ChatConsumerService extends KafkaConsumer {

  constructor(
    private readonly messageCreateHandler: MessageCreateHandler,
    @Inject('KAFKA_CLIENT') protected readonly kafka: Kafka
    
  ) {
    super(kafka, 'chat-consumer-group');
    this.subscribeToHandler(messageCreateHandler);
    this.run();
  }
}