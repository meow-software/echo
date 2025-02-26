import { IsNumberString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNumberString()
  @IsNotEmpty()
  senderId: string; 

  @IsNumberString()
  @IsNotEmpty()
  channelId: string; 

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000) 
  content: string;
}
