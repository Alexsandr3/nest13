import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { ForbiddenExceptionMY, NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdateBlogCommand } from "../update-blog-command";


@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { blogInputModel, blogId, userId } = command;
    const blog = await this.blogsRepositories.findBlog(blogId, userId)
    if(userId !== blog.userId) throw new ForbiddenExceptionMY(`You are not the owner of the blog`)
    const result = await this.blogsRepositories.updateBlog(blogId, userId, blogInputModel);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${blogId}`);
    return true;
  }
}


