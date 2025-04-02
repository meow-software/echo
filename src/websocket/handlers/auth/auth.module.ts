import { Module } from '@nestjs/common';
import { AuthWebsocketHandlers } from './auth-websocket-handlers';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/websocket/shared/shared.module';
import { CreateMessageCommand } from '../message/commands/create-message.command';

@Module({
  imports : [
    JwtModule.register({}), 
    SharedModule
  ],
  providers: [
    AuthWebsocketHandlers,
    CreateMessageCommand
  ],
  exports: [
    AuthWebsocketHandlers  
  ]})
export class AuthModule {}
