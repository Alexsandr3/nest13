import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  /**
   * content for Posts
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(20, 300)
  content: string;
}
