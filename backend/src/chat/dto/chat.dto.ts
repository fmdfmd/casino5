import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export enum SenderType {
  USER = 'user',
  SUPPORT = 'support',
  SYSTEM = 'system',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
}

export class InitChatDto {
  @IsString()
  @IsNotEmpty()
  guestId: string;

  @IsOptional()
  userId?: string;
}

export class SendMessageDto {
  @IsNotEmpty()
  chatId: number; // ID сессии (числовой, как в базе)

  @IsString()
  @IsNotEmpty()
  message: string;

  // Фронтенд может присылать 'guest', но мы внутри мапим это в 'user'
  @IsOptional()
  senderType?: string;
}
