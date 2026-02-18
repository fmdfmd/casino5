import { SetMetadata } from '@nestjs/common';

export const CheckAbility = (action, subject) =>
  SetMetadata('ability', { action, subject });
