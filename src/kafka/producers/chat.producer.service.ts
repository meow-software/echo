import { Injectable } from '@nestjs/common';
import { ClientKafka, Transport, Client } from '@nestjs/microservices';  
import { kafkaConfig } from '../config.kafka';


@Injectable()
export class ChatProducerService {
    @Client({
      transport: Transport.KAFKA,
      options: kafkaConfig,
    })
    private client: ClientKafka;
  
    async send(event:any, message: any) {
      this.client.emit("SEND_MESSAGE", message); 
    }
  }