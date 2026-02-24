import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UsersRepository } from 'src/users/users.repository';
import { AccessTokenGuard } from './guards/jwt.guard';
import { CaslGuard } from 'src/casl/CaslGuard';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private usersRepo: UsersRepository,
  ) {}

  // --- LOCAL: Register ---
  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.register(body.email, body.password);

    return this.issueTokens(user, res);
  }

  // --- LOCAL: Login ---
  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(body.email, body.password);

    return this.issueTokens(user, res);
  }

  // --- GOOGLE: Redirect ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const googleUser = await this.authService.validateGoogleUser(req.user);

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      googleUser.id,
      googleUser.email,
    );

    this.setCookies(res, accessToken, refreshToken);

    // Редирект на фронтенд
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    res.redirect(`${frontendUrl}`);
  }

  // --- SHARED: Refresh ---
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user,
    );

    this.setCookies(res, accessToken, refreshToken);

    return { accessToken };
  }

  @Get('me')
  @UseGuards(AccessTokenGuard, CaslGuard)
  async getProfile(@Req() req) {
    const userId = req.user.sub;
    const user = await this.usersRepo.findById(userId, { withRoles: true });

    if (!user) {
      throw new UnauthorizedException();
    }
    return new UserResponseDto(user);
  }

  private async issueTokens(user: any, res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.id,
      user.email,
      user.roles,
    );
    this.setCookies(res, accessToken, refreshToken);
    return user;
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.sub);

    this.clearCookies(res);

    return { success: true };
  }

  private setCookies(res: Response, access: string, refresh: string) {
    const isProduction = this.config.get('NODE_ENV') === 'production';

    // Access Token: короткий срок жизни, доступен везде
    res.cookie('access_token', access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax', // Lax нужен для прохождения редиректов OAuth
      maxAge: 15 * 60 * 1000, // 15 минут
      // maxAge: 1000 * 10,
    });

    // Refresh Token: долгий срок, доступен ТОЛЬКО по пути /auth/refresh
    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      // path: '/auth/refresh', // Security hardening: токен не летит на обычные API запросы
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }

  private clearCookies(res: Response) {
    const isProduction = this.config.get('NODE_ENV') === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax', // Lax нужен для прохождения редиректов OAuth
      // maxAge: 1000 * 10,
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      // path: '/auth/refresh', // Security hardening: токен не летит на обычные API запросы
    });
  }
}
