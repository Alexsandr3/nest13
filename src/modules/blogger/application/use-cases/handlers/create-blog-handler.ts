import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBlogCommand } from "../create-blog-command";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { UnauthorizedExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "../../../domain/blog-schema-Model";

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
    private readonly blogsRepositories: BlogsRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command.blogInputModel;
    const { userId } = command;
    //finding the user for check ex
    const user = await this.usersRepositories.findUserByIdWithMapped(userId);
    if (user.id !== userId) throw new UnauthorizedExceptionMY(`user with id: ${userId} Unauthorized`);
    //preparation Blog for save in DB
    const newBlog = Blog.createBlog(userId, user.getLogin(), name, description, websiteUrl);
    //create instance
    const blog = new this.blogsModel(newBlog);
    //save created instance
    const createdBlog = await this.blogsRepositories.saveBlog(blog);
    if (!createdBlog) throw new Error(`Not created`);
    return createdBlog.id;
  }
}
