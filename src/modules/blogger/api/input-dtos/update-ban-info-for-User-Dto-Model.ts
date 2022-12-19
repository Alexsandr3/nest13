import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsMongoIdObject } from "../../../../helpers/decorator-IsMongoIdObject";

export class UpdateBanInfoForUserDto {
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
  /**
   * id for Blog
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsMongoIdObject()
  blogId: string;
}
