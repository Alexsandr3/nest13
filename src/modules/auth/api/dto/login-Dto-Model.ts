import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class LoginDto {
  /**
   * login: Login User
   */
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  loginOrEmail: string;
  /**
   * password: password User
   */
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  password: string;
}
