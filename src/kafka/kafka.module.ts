import { forwardRef, Module } from '@nestjs/common';  
import { LogsProducerService } from './producers/logs.producer.service';
import { ChatProducerService } from './producers/chat.producer.service';
import { ChatConsumerService } from './consumers/chat.consumer.service';
import { WebsocketModule } from 'src/messaging/messaging.module';

@Module({
  imports : [
    // circular dependance
    forwardRef(() => WebsocketModule)
  ],
  providers: [ChatProducerService, LogsProducerService, ChatConsumerService],
  exports: [ChatProducerService, LogsProducerService, ChatConsumerService],
})
export class KafkaModule {}
