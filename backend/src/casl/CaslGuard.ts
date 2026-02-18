import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AbilityFactory } from './AbilityFactory';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private abilityFactory: AbilityFactory,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const ability = this.abilityFactory.createForUser(user);

    const rule = this.reflector.get('ability', ctx.getHandler());
    if (!rule) return true;

    return ability.can(rule.action, rule.subject);
  }
}
