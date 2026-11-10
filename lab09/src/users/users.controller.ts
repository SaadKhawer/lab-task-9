import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import type { SafeUser } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Task 6 — admin only. AuthGuard runs first (checks the token),
   * RolesGuard runs second (checks the role). A normal user gets 403,
   * no token gets 401. The password hash is never returned.
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(): Promise<SafeUser[]> {
    return this.usersService.findAll();
  }
}
