import { Module } from '@nestjs/common';  
import { kafkaConfigClientModule } from './config.kafka';
import { ProducerService } from './producers/producer.service';
import { ChatConsumerService } from './consumers/chat-consumer.service';
import { NotificationConsumerService } from './consumers/notification-consumer.service';
import { KafkaHandlerModule } from './kafka-handler.module';

@Module({
  imports : [
    // circular dependance
    KafkaHandlerModule,
  ],
  providers: [
    ProducerService, 
    ChatConsumerService,
    NotificationConsumerService,
    // Client Kafka
    {...kafkaConfigClientModule}
  ],
  exports: [ProducerService, ChatConsumerService, NotificationConsumerService],
})
export class KafkaModule {}
