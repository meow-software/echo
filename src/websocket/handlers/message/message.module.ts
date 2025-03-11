import { Module } from '@nestjs/common';
import { MessageWebsocketHandlers } from './message-websocket-handlers';
import { SharedModule } from 'src/websocket/shared/shared.module';
import { KafkaSharedModule } from 'src/websocket/shared/kafka-shared.module';
import { CreateMessageHandler } from './commands/handlers/create-message.handler';
import { DeleteMessageHandler } from './commands/handlers/delete-message.handler';
import { UpdateMessageHandler } from './commands/handlers/update-message.handler';
import { MessageKafkaEventHandler } from './message-kafka-event-handler.service';
import { MessageCacheService, MessageRepository } from '@tellme/shared';

@Module({
  imports : [
    SharedModule,
    KafkaSharedModule
  ], 
  providers: [
    MessageWebsocketHandlers,
    MessageKafkaEventHandler,
    MessageCacheService,
    MessageRepository,
    CreateMessageHandler,
    DeleteMessageHandler,
    UpdateMessageHandler
  ],
  exports: [
    MessageWebsocketHandlers, MessageKafkaEventHandler
  ]})
export class MessageModule {}
