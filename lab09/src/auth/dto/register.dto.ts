import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

/**
 * Password rule (shared with ChangePasswordDto):
 * at least 8 characters, one uppercase letter and one number.
 */
export const PASSWORD_RULE =
  /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_RULE, {
    message:
      'Password must be at least 8 characters and contain one uppercase letter and one number',
  })
  password: string;

  // NOTE: there is deliberately no `role` or `isAdmin` field here.
  // New accounts are always role 'user'; the global ValidationPipe
  // (forbidNonWhitelisted) rejects extra properties such as isAdmin
  // with a 400 — see Task 1.
}
