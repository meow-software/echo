import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { PrismaService, RedisClientService, SnowflakeService } from '@tellme/common';
import { DtoChecker, RedisModule, WsErrorHandlerService, RepositoryModule } from '@tellme/shared';

@Module({
  imports : [
    CqrsModule,
    RedisModule,
    RepositoryModule,
  ],
  providers: [
    // RedisClientService,
    WsErrorHandlerService,
    DtoChecker,
    WsErrorHandlerService,
    CommandBus,
    SnowflakeService,
    PrismaService
  ],
  exports: [
    // RedisClientService, 
    WsErrorHandlerService, 
    DtoChecker, 
    CommandBus,
    SnowflakeService,
    PrismaService,
    RedisModule
  ],
})
export class SharedModule {}
