import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PreparationBlogForDB } from "../../../domain/blog-preparation-for-DB";
import { CreateBlogCommand } from "../create-blog-command";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogsRepositories: BlogsRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  async execute(command: CreateBlogCommand): Promise<string> {
    debugger
    const { name, description, websiteUrl } = command.blogInputModel;
    const { userId } = command;
    const user = await this.usersRepositories.findUser(userId);
    //preparation Blog for save in DB
    const newBlog = new PreparationBlogForDB(
      userId,
      user.accountData.login,
      name,
      description,
      websiteUrl,
      new Date().toISOString(),
      false
    );
    return await this.blogsRepositories.createBlog(newBlog);

  }
}
