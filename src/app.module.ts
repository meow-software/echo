import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config'; 
import { WebsocketModule } from './messaging/messaging.module'; 
import { DtoChecker } from './dto-checker.service';
import { WsErrorHandlerService } from './messaging/error/ws-error-handler.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}), 
    RedisModule, 
    KafkaModule, 
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [AppService, DtoChecker, WsErrorHandlerService],
  exports : [DtoChecker],
})
export class AppModule {}
