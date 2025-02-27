import { Inject, Injectable } from '@nestjs/common';
import { KafkaConsumer } from '../kafka-consumer.abstract';
import { EachMessagePayload, Kafka, KafkaMessage } from 'kafkajs';
import { MessageCreateHandler } from '../handler/message-create-handler.service';

@Injectable()
/**
 * Actually use just for example of how to use KafkaConsumer
 */
export class NotificationConsumerService extends KafkaConsumer {

  constructor(
    private readonly messageCreateHandler: MessageCreateHandler,
    @Inject('KAFKA_CLIENT') protected readonly kafka: Kafka
    
  ) {
    super(kafka, 'notification-consumer-group');
    // subscribe to Handler
    console.log()
    this.subscribeToHandler(messageCreateHandler);
    this.run();
  }
  protected consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): void {
      const handler = this.handlers.find(h => h.eventType as string === event);
  
      if (handler) {
        console.log(`Consuming ${event} from NotificationConsumer, data: ${this.fromKafkaMessageToObj(message).value}`);
      }
    }

}