import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/drizzle/schema/users.schema';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'ban';
export type Subjects = 'User' | 'Game' | 'Room' | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User & { roles: any[] }): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);
    // user.permissions.forEach((p) => {
    //   can(p.action, p.subject, p.conditions);
    // });

    return build();
  }
}
