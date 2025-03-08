import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config'; 
import { WebsocketModule } from './websocket/messaging-websocket.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}), 
    KafkaModule, 
    WebsocketModule, 
  ],
  controllers: [AppController],
})
export class AppModule {}
