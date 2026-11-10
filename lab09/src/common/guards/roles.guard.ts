import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { UserRole } from '../../users/user.entity';

/**
 * Task 6 — RolesGuard. Runs AFTER AuthGuard (see the guard order in
 * UsersController: @UseGuards(AuthGuard, RolesGuard)), so req.user
 * already exists here. If the route has no @Roles() it allows anyone
 * who is logged in; otherwise the user's role must be one of them,
 * else 403.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const role = req.user?.role as UserRole | undefined;
    if (role && required.includes(role)) return true;
    throw new ForbiddenException('You do not have access to this resource');
  }
}
