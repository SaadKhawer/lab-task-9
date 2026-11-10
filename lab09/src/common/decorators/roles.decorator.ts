import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../users/user.entity';

export const ROLES_KEY = 'roles';

/** Task 6 — marks a route with the roles allowed to use it. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
