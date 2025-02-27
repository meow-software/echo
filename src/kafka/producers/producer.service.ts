import { Inject, Injectable } from '@nestjs/common';
import { KafkaProducer } from '../kafka-producer.abstract';
import { Kafka } from 'kafkajs';


@Injectable()
export class ProducerService extends KafkaProducer { 
  constructor(
    @Inject('KAFKA_CLIENT') protected readonly kafkaClient: Kafka
  ) {
    super(kafkaClient);
  }
}