import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';

@Injectable()
export class BcryptHashService implements HashService {
  private readonly rounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.rounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
