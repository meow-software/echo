import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Transport, Client, MessagePattern, Payload } from '@nestjs/microservices';  
import { kafkaConfigConsumerChatGroup } from '../config.kafka';
import { MessagingGateway } from 'src/messaging/messaging.gateway';


@Injectable()
export class ChatConsumerService implements OnModuleInit {
    @Client({
      transport: Transport.KAFKA,
      options: kafkaConfigConsumerChatGroup,
    })
    private client: ClientKafka;
  
    constructor(private readonly websocketGateway: MessagingGateway) {}
  
    async onModuleInit() {
      this.client.subscribeToResponseOf('chat-messages');
      await this.client.connect();
    }
  
    @MessagePattern('SEND_MESSAGE')
    handleMessage(@Payload() message: any) {
      console.log('Message reçu pour diffusion:', message);
      this.websocketGateway.server.emit('message', message); 
    }
  }