import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/drizzle/schema/users.schema';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepo: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessToken(req);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.verifyAccessToken(accessToken);
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

    req.user = { ...payload, roles: userRolesTable };

    return true;
  }

  private extractAccessToken(req: Request): string | null {
    if (!req) return null;

    const cookieToken = req.cookies?.access_token;
    if (cookieToken && typeof cookieToken === 'string') {
      return cookieToken;
    }

    const authHeader = req.headers?.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }

      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('TOKEN_INVALID');
      }

      throw err;
    }
  }
}
