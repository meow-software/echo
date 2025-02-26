import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Transport, Client, MessagePattern, Payload } from '@nestjs/microservices';  
import { kafkaConfigConsumerChatGroup } from '../config.kafka';
import { MessageWebsocketHandlers } from 'src/messaging/handlers/message-websocket-handlers';
import { RedisClientService } from 'src/redis/redis.client.service';
import { EchoEvent } from 'src/messaging/echo-event';


@Injectable()
export class ChatConsumerService implements OnModuleInit {
    @Client({
      transport: Transport.KAFKA,
      options: kafkaConfigConsumerChatGroup,
    })
    private client: ClientKafka;
  
    constructor(
    // private readonly websocketHandler: MessageWebsocketHandlers,
    // private readonly redisService: RedisClientService,  // Pour cache rapide
    // private readonly messageRepository: MessageRepository  
    ) {}
  
    async onModuleInit() {
      this.client.subscribeToResponseOf('chat-messages');
      await this.client.connect();
    }
  

    @MessagePattern('chat-messages')
    async handleKafkaMessage(@Payload() message: any) {
      console.log('Message reçu de Kafka:', message);
  
      if (!message || !message.channelId) return;
      
      // const room = message.type+message.sourceId+message
      const room = message.getRoom();

      // 1. Diffuser aux utilisateurs WebSocket connectés
      // this.websocketHandler.emitToRoom(room, EchoEvent.MessageCreate, message);
  
      // 2. Stocker dans Redis (clé unique avec timestamp)
      // await this.redisService.set(`MSG:${message.channelId}:${Date.now()}`, JSON.stringify(message));
  
      // 3. Sauvegarder dans la base de données
      // await this.messageRepository.save(message);
    }
  }