import { UpdateBanInfoForBlogDto } from "../../api/dtos/update-ban-info-for-blog-Dto-Model";

export class UpdateBanInfoForBlogCommand {
  constructor(
    public readonly updateBanInfoForBlogModel: UpdateBanInfoForBlogDto,
    public readonly blogId: string
  ) {
  }
}
