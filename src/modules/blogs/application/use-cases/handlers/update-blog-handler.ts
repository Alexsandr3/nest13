import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositories } from "../../../infrastructure/blogs.repositories";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdateBlogCommand } from "../update-blog-command";


@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { blogInputModel } = command;
    const { id } = command;
    const result = await this.blogsRepositories.updateBlog(id, blogInputModel);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    return true;
  }
}


