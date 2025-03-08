import { Module } from '@nestjs/common';
import { MessageModule } from '../websocket/handlers/message/message.module';
import { MessageCreateKafkaHandler } from 'src/websocket/handlers/message/message-create-kafka-handler.service';
import { SharedModule } from 'src/websocket/shared/shared.module';

@Module({
  imports : [
      MessageModule,
      SharedModule
  ],
  providers: [
    MessageCreateKafkaHandler,
  ],
  exports: [
    MessageCreateKafkaHandler
  ],
})
export class KafkaHandlerModule {}
