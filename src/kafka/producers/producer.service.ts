import { Inject, Injectable } from '@nestjs/common';
import { AbstractKafkaProducer } from '@tellme/common';
import { Kafka } from 'kafkajs';


@Injectable()
export class ProducerService extends AbstractKafkaProducer { 
  constructor(
    @Inject('KAFKA_CLIENT') protected readonly kafkaClient: Kafka
  ) {
    super(kafkaClient);
  }
}