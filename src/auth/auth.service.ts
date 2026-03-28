import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userService.create(dto);
    return {
      user,
      accessToken: this.signAccessToken(user.id, user.email, user.role),
      refreshToken: this.signRefreshToken(user.id, user.email, user.role),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: _pw, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: this.signAccessToken(user.id, user.email, user.role),
      refreshToken: this.signRefreshToken(user.id, user.email, user.role),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number; email: string; role: string }>(
        refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret' },
      );
      return {
        accessToken: this.signAccessToken(payload.sub, payload.email, payload.role),
        refreshToken: this.signRefreshToken(payload.sub, payload.email, payload.role),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async me(userId: number) {
    return this.userService.findOne(userId);
  }

  private signAccessToken(userId: number, email: string, role: string): string {
    return this.jwtService.sign({ sub: userId, email, role });
  }

  private signRefreshToken(userId: number, email: string, role: string): string {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
        expiresIn: '30d',
      },
    );
  }
}
