import { forwardRef, Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt'; 
import { WsErrorHandlerService } from './error/ws-error-handler.service';
import { MessageWebsocketHandlers } from './handlers/message-websocket-handlers';
import { AuthWebsocketHandlers } from './handlers/auth-websocket-handlers';
import { MessagingGateway } from './messaging.gateway';


@Module({
  imports : [
    // circular dependance
    forwardRef(() => KafkaModule), 
    RedisModule, 
    JwtModule.register({})
  ],
  exports: [MessagingGateway],
  providers: [
    MessagingGateway,
    WsErrorHandlerService,
    AuthWebsocketHandlers,
    MessageWebsocketHandlers
  ]
})
export class WebsocketModule {}
