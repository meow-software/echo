import { forwardRef, Module } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { RedisClientService } from '@tellme/common';
import { DtoChecker, WsErrorHandlerService } from '@tellme/shared';
import { kafkaConfigClientModule } from 'src/kafka/config.kafka';
import { ChatConsumerService } from 'src/kafka/consumers/chat-consumer.service';
import { NotificationConsumerService } from 'src/kafka/consumers/notification-consumer.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ProducerService } from 'src/kafka/producers/producer.service';
import { MessageModule } from '../handlers/message/message.module';

@Module({
  imports : [
  ],
  providers: [
    RedisClientService,
    WsErrorHandlerService,
    DtoChecker,
    WsErrorHandlerService,
    CommandBus,
  ],
  exports: [
    RedisClientService, 
    WsErrorHandlerService, 
    DtoChecker, 
    CommandBus,
  ],
})
export class SharedModule {}
