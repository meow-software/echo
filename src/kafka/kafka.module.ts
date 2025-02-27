import { forwardRef, Module } from '@nestjs/common';  
import { WebsocketModule } from 'src/messaging/messaging.module';
import { ProducerService } from './producers/producer.service';
import { RedisModule } from 'src/redis/redis.module';
import { kafkaConfigClientModule } from './config.kafka';
import { MessageCreateHandler } from './handler/message-create-handler.service';
import { ChatConsumerService } from './consumers/chat-consumer.service';
import { Kafka } from 'kafkajs';
import { NotificationConsumerService } from './consumers/notification-consumer.service';

@Module({
  imports : [
    // circular dependance
    forwardRef(() => WebsocketModule),
    RedisModule,
  ],
  providers: [
    ProducerService, 
    ChatConsumerService,
    NotificationConsumerService,
    // Client Kafka
    {...kafkaConfigClientModule},
    // Kafka Handlers
    MessageCreateHandler
  ],
  exports: [ProducerService],
})
export class KafkaModule {}
