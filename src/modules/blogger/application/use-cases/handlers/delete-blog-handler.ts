import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { DeleteBlogCommand } from "../delete-blog-command";
import { ForbiddenExceptionMY, NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";


@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const { blogId, userId } = command;
    const blog = await this.blogsRepositories.findBlog(blogId, userId)
    if(userId !== blog.userId) throw new ForbiddenExceptionMY(`You are not the owner of the blog`)
    const result = await this.blogsRepositories.deleteBlog(blogId, userId);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${blogId}`);
    return true;
  }

}


