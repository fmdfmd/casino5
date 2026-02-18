import { User } from 'src/drizzle/schema/users.schema';

export class UserResponseDto {
  id: string;
  email: string;
  roles?: string[];
  firstName?: string | null;
  picture?: string | null;
  isOnline: boolean | null;

  constructor(user: User & { userRolesTable?: any[] }) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.picture = user.picture;
    this.isOnline = user.isOnline;

    this.roles = user.userRolesTable
      ? user.userRolesTable.map((ur) => ur.role.name)
      : [];
  }
}
