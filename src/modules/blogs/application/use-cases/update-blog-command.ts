import { UpdateBlogDto } from "../../api/input-Dtos/update-Blog-Dto-Model";

export class UpdateBlogCommand {
  constructor(public readonly id: string,
              public readonly blogInputModel: UpdateBlogDto) {
  }

}

