import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import type { SafeUser } from '../users/user.entity';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: { id: number; email: string; role: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async register(dto: RegisterDto) {
    const user: SafeUser = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });
    return { access_token: this.signToken(user), user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    // Same error for an unknown email and a wrong password, so an
    // attacker cannot tell which one failed (see README question 4).
    const invalid = new UnauthorizedException('Invalid email or password');
    if (!user) throw invalid;
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw invalid;
    const { passwordHash: _hash, ...safe } = user;
    return { access_token: this.signToken(safe), user: safe };
  }

  /** Task 5 — change password for the logged-in user. */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const currentOk = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentOk) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }
    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(user.id, newHash);
    // The response never contains a hash.
    return { message: 'Password updated' };
  }
}
