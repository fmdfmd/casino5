import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { forwardRef, Inject } from '@nestjs/common';

@Processor('message')
export class MessageConsumer extends WorkerHost {
  private readonly logger = new Logger(MessageConsumer.name);

  constructor(
    private readonly chatService: ChatService,
    // Инжектим Gateway, чтобы иметь доступ к this.server.to().emit()
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {
    super();
  }

  async process(job: Job) {}
}
