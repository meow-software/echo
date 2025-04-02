import { forwardRef, Module } from '@nestjs/common';
import { kafkaConfigClientModule } from 'src/kafka/config.kafka';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ProducerService } from 'src/kafka/producers/producer.service';
import { SharedModule } from './shared.module';

@Module({
  imports : [
    forwardRef(() => KafkaModule), 
    SharedModule
  ],
  providers: [
    {...kafkaConfigClientModule},
    ProducerService,
  ],
  exports: [
    ProducerService, 
  ],
})
export class KafkaSharedModule {}
