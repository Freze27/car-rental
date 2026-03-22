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
    const accessToken = this.signToken(user.id, user.email, user.role);
    return { user, accessToken };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signToken(user.id, user.email, user.role);
    const { password: _pw, ...safeUser } = user;

    return { user: safeUser, accessToken };
  }

  async me(userId: number) {
    return this.userService.findOne(userId);
  }

  private signToken(userId: number, email: string, role: string): string {
    return this.jwtService.sign({ sub: userId, email, role });
  }
}
