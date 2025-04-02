
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageCacheService, MessageEntity, MessageRepository } from '@tellme/shared';
import { DeleteMessageCommand } from '../delete-message.command';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(
    protected readonly messageCacheService: MessageCacheService,
    protected readonly messageRepository: MessageRepository,
  ) {}
  async execute(commandMessage: DeleteMessageCommand): Promise<any> {
    const { messageDto } = commandMessage;
    const messageDeleted : MessageEntity = await this.messageRepository.delete(messageDto.messageId);
    this.messageCacheService.deleteMessage(messageDeleted);
    return messageDeleted;
  } 
}
