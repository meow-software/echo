import { Injectable } from '@nestjs/common';
import { ClientKafka, Transport, Client } from '@nestjs/microservices';  
import { kafkaConfig } from '../config.kafka';

@Injectable()
export class LogsProducerService {
    @Client({
      transport: Transport.KAFKA,
      options: kafkaConfig,
    })
    private client: ClientKafka;
  
    async sendLog(log: any) {
      this.client.emit('activity-logs', log); 
    }
}