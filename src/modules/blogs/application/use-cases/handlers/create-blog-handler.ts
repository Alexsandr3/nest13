import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PreparationBlogForDB } from "../../../domain/blog-preparation-for-DB";
import { CreateBlogCommand } from "../create-blog-command";
import { BlogsRepositories } from "../../../infrastructure/blogs.repositories";


@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command.blogInputModel;
    //preparation Blog for save in DB
    const newBlog = new PreparationBlogForDB(
      name,
      description,
      websiteUrl,
      new Date().toISOString()
    );
    return await this.blogsRepositories.createBlog(newBlog);
  }
}


