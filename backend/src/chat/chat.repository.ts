import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { SenderType } from './dto/chat.dto';

@Injectable()
export class ChatRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
}
