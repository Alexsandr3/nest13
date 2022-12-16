import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PreparationBlogForDB } from "../../../domain/blog-preparation-for-DB";
import { CreateBlogCommand } from '../create-blog-command';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';
import { UsersQueryRepositories } from '../../../../users/infrastructure/query-reposirory/users-query.reposit';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogsRepositories: BlogsRepositories,
    private readonly usersQueryRepositories: UsersQueryRepositories,
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command.blogInputModel;
    const { userId } = command;
    const user = await this.usersQueryRepositories.findUser(userId);
    //preparation Blog for save in DB

    const newBlog = new PreparationBlogForDB(
      userId,
      user.login,
      name,
      description,
      websiteUrl,
      new Date().toISOString(),
    );

    return await this.blogsRepositories.createBlog(newBlog);
  }
}
