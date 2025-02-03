import { forwardRef, Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { KafkaModule } from 'src/kafka/kafka.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt'; 
import { WsErrorHandlerService } from './error/ws-error-handler.service';
import { AuthHandlers } from './handlers/auth-handlers/auth-handlers';
import { MessageHandlers } from './handlers/message-handlers/message-handlers';

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
    AuthHandlers,
    MessageHandlers
  ]
})
export class WebsocketModule {}
