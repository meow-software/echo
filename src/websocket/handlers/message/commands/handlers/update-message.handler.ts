
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageCacheService, MessageEntity, MessageRepository } from '@tellme/shared';
import { SnowflakeService } from '@tellme/common';
import { UpdateMessageCommand } from '../update-message.command';

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageHandler implements ICommandHandler<UpdateMessageCommand> {
  constructor(
    protected readonly messageCacheService: MessageCacheService,
    protected readonly messageRepository: MessageRepository,
    protected readonly snowflakeService: SnowflakeService,
  ) {}
  async execute(commandMessage: UpdateMessageCommand): Promise<any> {
    const { messageDto } = commandMessage;
    // TODO : Implement UpdateMessageHandler
    // const messageEntity = new  MessageEntity.edit(messageDto.messageId, messageDto.channelId, messageDto.senderId, messageDto.content);
    // return message or propage error
    // return await this.messageRepository.update(messageEntity);
  }
}
