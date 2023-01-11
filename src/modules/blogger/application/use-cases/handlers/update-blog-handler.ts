import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdateBlogCommand } from "../update-blog-command";

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { blogInputModel, blogId, userId } = command;
    const blog = await this.blogsRepositories.findBlog(blogId);
    if (!blog)
      throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (blog.checkOwner(userId)) {
      blog.updateBlog(blogInputModel);
      const result = await this.blogsRepositories.saveBlog(blog);
      if (!result) throw new Error(`Not saved blog for id: ${blogId}`);
      return true;
    }
    throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
  }
}
