import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  /**
   * Title Posts
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 30)
  title: string;
  /**
   * Short description for Posts
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  /**
   * content for Posts
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(1, 1000)
  content: string;
  /**
   * id for Blog
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  blogId: string;
}
