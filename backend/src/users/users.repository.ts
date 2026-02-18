import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import * as schema from 'src/drizzle/schema/schema';
import {
  NewUser,
  User,
  users,
  UserWithRoles,
} from 'src/drizzle/schema/users.schema';
export * as schema from 'src/drizzle/schema/schema';

type WithRolesOption = {
  withRoles?: boolean;
};

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async findByEmail(email: string, options?: { withRoles?: boolean }) {
    const result = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: options?.withRoles
        ? { userRolesTable: { with: { role: true } } }
        : undefined,
    });

    return result;
  }

  async findById(id: string): Promise<User | null>;

  async findById(
    id: string,
    options: { withRoles: true },
  ): Promise<UserWithRoles | null>;

  async findById(
    id: string,
    options?: WithRolesOption,
  ): Promise<User | UserWithRoles | null> {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      with: options?.withRoles
        ? {
            userRolesTable: {
              with: {
                role: true,
              },
            },
          }
        : undefined,
    });
    return result ?? null;
  }

  // async findById(id: string, options?: { withRoles?: boolean }) {
  //   const result = await this.db.query.users.findFirst({
  //     where: eq(users.id, id),
  //     with: options?.withRoles
  //       ? { userRolesTable: { with: { role: true } } }
  //       : undefined,
  //   });
  //   return result;
  // }

  async create(data: NewUser) {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  async updateRefreshToken(userId: string, hash: string | null) {
    await this.db
      .update(users)
      .set({ refreshTokenHash: hash })
      .where(eq(users.id, userId));
  }

  async update(id: string, data: Partial<User>) {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}
