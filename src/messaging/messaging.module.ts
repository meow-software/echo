import { forwardRef, Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt'; 
import { WsErrorHandlerService } from './error/ws-error-handler.service';
import { MessageWebsocketHandlers } from './handlers/message-websocket-handlers';
import { AuthWebsocketHandlers } from './handlers/auth-websocket-handlers';
import { MessagingGateway } from './messaging.gateway';
import { DtoChecker } from 'src/dto-checker.service';


@Module({
  imports : [
    // circular dependance
    forwardRef(() => KafkaModule), 
    RedisModule, 
    JwtModule.register({}),
  ],
  exports: [
    MessagingGateway,
    MessageWebsocketHandlers],
  providers: [
    MessagingGateway,
    WsErrorHandlerService,
    DtoChecker,
    // Handler
    AuthWebsocketHandlers,
    MessageWebsocketHandlers
  ]
})
export class WebsocketModule {}
