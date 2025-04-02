import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { PrismaService, SnowflakeService } from '@tellme/common';
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
    SnowflakeService,
    PrismaService
  ],
  exports: [
    // RedisClientService, 
    WsErrorHandlerService, 
    DtoChecker, 
    SnowflakeService,
    PrismaService,
    RedisModule,
    CqrsModule
  ],
})
export class SharedModule {}
