import { IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCommentDto {
  /**
   * description
   */
  @Transform(({ value }) => value.trim())
  @IsString()
  @Length(20, 300)
  content: string;
}
