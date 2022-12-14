import { IsString, IsUrl, Length } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBlogDto {
  /**
   * name: Blog name
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 15)
  name: string;
  /**
   * description
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 500)
  description: string;
  /**
   * websiteUrl: Blog website Url
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
