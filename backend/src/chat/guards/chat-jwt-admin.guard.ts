import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class ChatJwtAdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepo: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractToken(client);
    try {
      const payload = await this.jwtService.verifyAsync(token || '', {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      const userId = payload.sub;
      const user = await this.usersRepo.findById(userId, {
        withRoles: true,
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      const userRolesTable = user!.userRolesTable.map((r) => {
        return r.role.name;
      });

      client.data.user = { ...payload, roles: userRolesTable };
      client.data.isGuest = false;
      return true;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        client.emit('auth:refresh_required');
      }

      return false;
    }
  }

  private extractToken(client: Socket): string | null {
    const cookie = client.handshake.headers.cookie;
    if (!cookie) return null;

    const match = cookie.match(/access_token=([^;]+)/);
    return match?.[1] ?? null;
  }
}
