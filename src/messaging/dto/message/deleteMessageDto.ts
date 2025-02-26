import { IsNumberString, IsNotEmpty } from 'class-validator';

export class DeleteMessageDto {
  @IsNumberString()
  @IsNotEmpty()
  messageId: string; 
}
