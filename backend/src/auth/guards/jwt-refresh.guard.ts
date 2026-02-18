import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersRepository } from 'src/users/users.repository';
import { HashService } from '../hash.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepo: UsersRepository,
    private readonly config: ConfigService,
    private readonly hashService: HashService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      throw new UnauthorizedException();
    }

    const payload = await this.verify(refresh_token);

    const user = await this.usersRepo.findById(payload.sub, {
      withRoles: true,
    });

    if (!user?.refreshTokenHash && refresh_token) {
      await this.usersRepo.update(payload.sub, {
        refreshTokenHash: await this.hashService.hash(refresh_token),
      });
    }

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const isValid = await this.hashService.compare(
      refresh_token,
      user.refreshTokenHash,
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const userRolesTable = user!.userRolesTable.map((r) => {
      return r.role.name;
    });

    req.user = { sub: user.id, email: user.email, roles: userRolesTable };
    return true;
  }

  private async verify(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
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
