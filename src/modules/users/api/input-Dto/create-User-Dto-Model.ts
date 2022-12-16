import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  /**
   * login: Login User
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(3, 10)
  login: string;
  /**
   * password: password User
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(6, 20)
  password: string;
  /**
   * email: email User
   */
  //@Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
