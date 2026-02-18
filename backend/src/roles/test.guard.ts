import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
