
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
    const messageEntity = MessageEntity.edit(messageDto.messageId, messageDto.channelId,messageDto.content);
    const message = await this.messageRepository.edit(messageEntity);
    await this.messageCacheService.updateMessage(messageEntity);
    return message;
  }
}
