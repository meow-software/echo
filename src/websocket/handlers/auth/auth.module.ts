import { Module } from '@nestjs/common';
import { AuthWebsocketHandlers } from './auth-websocket-handlers';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/websocket/shared/shared.module';

@Module({
  imports : [
    JwtModule.register({}), 
    SharedModule
  ],
  providers: [
    AuthWebsocketHandlers,
  ],
  exports: [
    AuthWebsocketHandlers  
  ]})
export class AuthModule {}
