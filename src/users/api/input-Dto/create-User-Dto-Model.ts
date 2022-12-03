import { IsEmail, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {
  /**
   * login: Login User
   */
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(3, 10)
  login: string;
  /**
   * password: password User
   */
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(6, 20)
  password: string;
  /**
   * email: email User
   */
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;
}
