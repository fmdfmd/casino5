import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SenderType } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepo: ChatRepository) {}
}
