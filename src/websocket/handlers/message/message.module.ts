import { Module } from '@nestjs/common';
import { MessageWebsocketHandlers } from './message-websocket-handlers';
import { MessageCreateKafkaHandler } from './message-create-kafka-handler.service';
import { SharedModule } from 'src/websocket/shared/shared.module';
import { ProducerService } from 'src/kafka/producers/producer.service';
import { kafkaConfigClientModule } from 'src/kafka/config.kafka';
import { RedisClientService } from '@tellme/common';
import { DtoChecker, WsErrorHandlerService } from '@tellme/shared';
import { CommandBus } from '@nestjs/cqrs';
import { KafkaSharedModule } from 'src/websocket/shared/kafka-shared.module';

@Module({
  imports : [
    SharedModule,
    KafkaSharedModule
  ],
  providers: [
    MessageWebsocketHandlers,
    MessageCreateKafkaHandler,
    // {...kafkaConfigClientModule},
    // ProducerService,
    //     RedisClientService,
    //     WsErrorHandlerService,
    //     DtoChecker,
    //     WsErrorHandlerService,
    //     CommandBus
  ],
  exports: [
    MessageWebsocketHandlers, MessageCreateKafkaHandler,
  ]})
export class MessageModule {}
