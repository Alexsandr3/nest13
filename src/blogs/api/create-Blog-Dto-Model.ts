import { IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  /**
   * name: Blog name
   */
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 15)
  name: string;
  /**
   * description
   */
  @IsString()
  @Transform(({ value }) => value.trim())
  @Length(1, 500)
  description: string;
  /**
   * websiteUrl: Blog website Url
   */
  @IsString()
  @IsUrl()
  @Transform(({ value }) => value.trim())
  @Length(1, 100)
  websiteUrl: string;
}
