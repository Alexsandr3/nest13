import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { LikeStatusType } from "../../domain/likesPost-schema-Model";

export class UpdateLikeStatusDto {
  /**
   * Send None if you want to unlike\undislike
   */
  @Transform(({ value }) => value.trim())
  @IsEnum(LikeStatusType)
  @IsOptional()
  "likeStatus": LikeStatusType = LikeStatusType.None;
}
