
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageCacheService, MessageEntity, MessageRepository, SnowflakeEntity } from '@tellme/shared';
import { SnowflakeService } from '@tellme/common';
import { DeleteMessageCommand } from '../delete-message.command';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(
    protected readonly messageCacheService: MessageCacheService,
    protected readonly messageRepository: MessageRepository,
  ) {}
  async execute(commandMessage: DeleteMessageCommand): Promise<any> {
    const { messageDto } = commandMessage;
    // return message or propage error
    const messgeDeleted = await this.messageRepository.delete(messageDto.messageId);

    // TODO : check if message existts delete
    // this.messageCacheService.delete(messageDto.messageId);

    return messgeDeleted;
  }
}
