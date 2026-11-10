import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // forwardRef: UsersModule imports AuthModule (for the guard),
    // and AuthModule imports UsersModule (for the service).
    forwardRef(() => UsersModule),
    JwtModule.register({
      // Dev default only — set JWT_SECRET in .env for anything real.
      secret: process.env.JWT_SECRET ?? 'lab09-dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
