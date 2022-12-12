import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositories } from "../../../infrastructure/blogs.repositories";
import { DeleteBlogCommand } from "../delete-blog-command";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";


@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const { id } = command;
    const result = await this.blogsRepositories.deleteBlog(id);
    if (!result) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }

}


