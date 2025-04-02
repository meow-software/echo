import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; 
import { MessagingGateway } from './messaging-websocket.gateway';

import { MessageModule } from './handlers/message/message.module';
import { AuthModule } from './handlers/auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports : [ 
    JwtModule.register({}), 
    AuthModule, 
    MessageModule, 
    SharedModule, 
  ],
  providers: [
    MessagingGateway, 
  ],
  exports: [
    MessagingGateway,
  ]
})
export class WebsocketModule {}
