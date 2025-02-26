import { IsNumberString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class GetMessagesDto {
  @IsNumberString()
  @IsNotEmpty()
  channelId: string; 

  @IsOptional()
  @IsNumberString()
  lastMessageId?: string; 

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number; 
}
