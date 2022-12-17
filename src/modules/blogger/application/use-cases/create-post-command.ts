import { CreatePostByBlogIdDto } from '../../../posts/api/input-Dtos/create-Post-By-BlogId-Dto-Model';

export class CreatePostCommand {
  constructor(
    public readonly postInputModel: CreatePostByBlogIdDto,
    public readonly blogId: string,
    public readonly userId: string,
  ) {}
}
