import { Module } from '@nestjs/common';
import { MessageModule } from '../websocket/handlers/message/message.module';
import { SharedModule } from 'src/websocket/shared/shared.module';
import { MessageKafkaEventHandler } from 'src/websocket/handlers/message/message-kafka-event-handler.service';

@Module({
  imports : [
      MessageModule,
      SharedModule
  ],
  providers: [
    MessageKafkaEventHandler,
  ],
  exports: [
    MessageKafkaEventHandler
  ],
})
export class KafkaHandlerModule {}
