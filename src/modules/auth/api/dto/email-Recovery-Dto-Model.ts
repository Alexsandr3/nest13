import { IsEmail, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class EmailRecoveryDto {
  /**
   * email: email User
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsEmail()
  email: string;
}
