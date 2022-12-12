import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { DeletePostCommand } from "../delete-post-command";
import { PostsRepositories } from "../../../infrastructure/posts-repositories";


@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepositories: PostsRepositories) {
  }

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { id } = command;
    const result = await this.postsRepositories.deletePost(id);
    if (!result) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }
}


