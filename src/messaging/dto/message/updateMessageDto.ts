import { IsNumberString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMessageDto {
  @IsNumberString()
  @IsNotEmpty()
  messageId: string; 

  @IsNumberString()
  @IsNotEmpty()
  channelId: string; 
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string; 
}
