import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { HashService } from './hash.service';
import { User, users } from 'src/drizzle/schema/users.schema';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import { currenciesTable } from 'src/drizzle/schema/currencies.schema';
import { walletsTable } from 'src/drizzle/schema/wallets.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepository,
    private jwtService: JwtService,
    private config: ConfigService,
    private hashService: HashService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  // --- 1. Validate Local User (Email/Pass) ---
  async validateLocalUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'> | null> {
    const user = await this.usersRepo.findByEmail(email, { withRoles: true });
    if (user && user.passwordHash) {
      const isMatch = await this.hashService.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, refreshTokenHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // --- 2. Register (Email/Pass) ---
  async register(email: string, pass: string) {
    return this.db.transaction(async (tx) => {
      const existingUser = await this.usersRepo.findByEmail(email);
      if (existingUser) throw new BadRequestException('Email already in use');

      const hashedPassword = await this.hashService.hash(pass);

      const [user] = await tx
        .insert(users)
        .values({
          email,
          passwordHash: hashedPassword,
          provider: 'local',
          providerId: null,
        })
        .returning();

      const currencies = await this.db.query.currenciesTable.findMany({
        where: eq(currenciesTable.isActive, true),
      });

      currencies.map(async (currency) => {
        await tx.insert(walletsTable).values({
          userId: user.id,
          currencyId: currency.id,
        });
      });

      return user;
    });
  }

  // --- 3. Validate Google User (OAuth) ---
  async validateGoogleUser(profile: any) {
    const { email, firstName, picture, providerId } = profile;
    const user = await this.usersRepo.findByEmail(email);

    if (user) {
      if (!user.providerId) {
        await this.usersRepo.update(user.id, {
          provider: 'google',
          providerId,
        });
      }
      return user;
    }

    // Create new Google user
    return this.usersRepo.create({
      email,
      firstName,
      picture,
      provider: 'google',
      providerId,
      passwordHash: null,
    });
  }

  async generateTokens(userId: string, email: string, roles = null) {
    const payload = { sub: userId, email, roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    // Хешируем refresh token перед сохранением (защита при утечке БД)

    return { accessToken, refreshToken };
  }

  async refreshTokens(user: any) {
    const userId = user.sub;
    const userEmail = user.email;
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      userEmail,
    );

    const hash = await this.hashService.hash(refreshToken);
    await this.usersRepo.updateRefreshToken(userId, hash);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateLocalUser(email, password);

    return user;
  }

  async logout(userId: string) {
    // Инвалидируем сессию в БД
    await this.usersRepo.updateRefreshToken(userId, null);
  }
}
