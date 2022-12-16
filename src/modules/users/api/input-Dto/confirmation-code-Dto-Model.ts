import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ConfirmationCodeDto {
  /**
   * Code that be sent via Email inside link
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 100)
  code: string;
}
