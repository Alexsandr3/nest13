import { CreatePostByBlogIdDto } from "../../../posts/api/input-Dtos/create-Post-By-BlogId-Dto-Model";


export class UpdatePostCommand {
  constructor(public readonly userId: string,
              public readonly blogId: string,
              public readonly postId: string,
              public readonly postInputModel: CreatePostByBlogIdDto) {
  }

}

