import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBanInfoDto {
  /**
   * isBanned: User
   */
  //@Transform(({ value }) => value.trim())
  @IsBoolean()
  @IsOptional()
  isBanned = true;
  /**
   * password: password User
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(20)
  banReason: string;
}
