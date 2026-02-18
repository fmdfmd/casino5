import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';

@Injectable()
export class UsersServices {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
}
