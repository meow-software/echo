
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from '../create-message.command';
import { MessageCacheService, MessageEntity, MessageRepository, SnowflakeEntity } from '@tellme/shared';
import { SnowflakeService } from '@tellme/common';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
  constructor(
    protected readonly messageCacheService: MessageCacheService,
    protected readonly messageRepository: MessageRepository,
    protected readonly snowflakeService: SnowflakeService,
  ) {}
  async execute(commandMessage: CreateMessageCommand): Promise<any> {
    const { messageDto } = commandMessage;
    const messageEntity = MessageEntity.new(this.snowflakeService, messageDto.channelId, messageDto.senderId, messageDto.content);
    const message = await this.messageRepository.create(messageEntity);
    await this.messageCacheService.saveMessage(messageEntity);
    return message;
  }
}
