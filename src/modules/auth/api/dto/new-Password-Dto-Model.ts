import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewPasswordDto {
  /**
   * New account recovery password.
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(6, 20)
  newPassword: string;
  /**
   * Code that be sent via Email inside link
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  recoveryCode: string;
}
