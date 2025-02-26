import { Injectable } from '@nestjs/common';
import { ClientKafka, Transport, Client } from '@nestjs/microservices';  
import { kafkaConfig } from '../config.kafka';
import { KAFKA_TOPIC } from '../kafka.topic';


@Injectable()
export class ChatProducerService {
    @Client({
      transport: Transport.KAFKA,
      options: kafkaConfig,
    })
    private client: ClientKafka;
  
    async send(message: any) {
      this.client.emit(KAFKA_TOPIC.ChatMessages, message); 
    }
  }