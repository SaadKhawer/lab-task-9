import { IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_RULE } from './register.dto';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_RULE, {
    message:
      'Password must be at least 8 characters and contain one uppercase letter and one number',
  })
  newPassword: string;
}
