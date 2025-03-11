import { Inject, Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AbstractKafkaConsumer } from '@tellme/common';

@Injectable()
/**
 * Actually use just for example of how to use KafkaConsumer
 */
export class NotificationConsumerService extends AbstractKafkaConsumer {

  constructor(
    // private readonly messageCreateHandler: MessageCreateHandler,
    @Inject('KAFKA_CLIENT') protected readonly kafka: Kafka,

  ) {
    super(kafka, 'notification-consumer-group');
    // subscribe to Handler
    console.log()
    // this.subscribeToHandler(messageCreateHandler);
    this.run();
  }
  // public consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): void {
  //   const handler = this.handlers.find(h => h.eventType as string === event);

  //   if (handler) {
  //     console.log(`Consuming ${event} from NotificationConsumer, data: ${this.fromKafkaMessageToObj(message).value}`);
  //   }
  // }

}