import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdatePostCommand } from "../update-post-command";
import { PostsRepositories } from "../../../infrastructure/posts-repositories";


@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postsRepositories: PostsRepositories) {
  }

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { postInputModel } = command;
    const { id } = command;
    const result = await this.postsRepositories.updatePost(id, postInputModel);
    if (!result) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }
}


