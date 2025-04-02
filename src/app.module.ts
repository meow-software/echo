import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config'; 
import { WebsocketModule } from './websocket/messaging-websocket.module';  

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}), 
    WebsocketModule, 
    KafkaModule, 
  ],
})
export class AppModule {}
