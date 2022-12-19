import { IsBoolean, IsOptional } from "class-validator";

export class UpdateBanInfoForBlogDto {
  /**
   * isBanned: User
   */
    //@Transform(({ value }) => value.trim())
  @IsBoolean()
  @IsOptional()
  isBanned = true;
}
