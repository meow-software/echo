import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config'; 
import { WebsocketModule } from './messaging/messaging.module'; 
import { DtoChecker } from './dto-checker/dto-checker.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}), 
    RedisModule, 
    KafkaModule, 
    WebsocketModule
  ],
  controllers: [AppController],
  providers: [AppService, DtoChecker],
  exports : [DtoChecker],
})
export class AppModule {}
