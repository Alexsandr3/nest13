import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateBanUserForCurrentBlogCommand } from "../update-ban-User-For-Current-Blog-command";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../../../helpers/My-HttpExceptionFilter";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { InjectModel } from "@nestjs/mongoose";
import { BlogBanInfo, BlogBanInfoDocument } from "../../../domain/ban-user-for-current-blog-schema-Model";
import { Model } from "mongoose";

@CommandHandler(UpdateBanUserForCurrentBlogCommand)
export class UpdateBanUserForCurrentBlogHandler
  implements ICommandHandler<UpdateBanUserForCurrentBlogCommand> {
  constructor(
    @InjectModel(BlogBanInfo.name) private readonly blogBanInfoModel: Model<BlogBanInfoDocument>,
    private readonly usersRepositories: UsersRepositories,
    private readonly blogsRepositories: BlogsRepositories) {
  }

  async execute(command: UpdateBanUserForCurrentBlogCommand): Promise<boolean> {
    const { id, userId } = command;
    const { isBanned, banReason, blogId } = command.banUserForCurrentBlogInputModel;
    const foundUser = await this.usersRepositories.findUserByIdWithMapped(id);
    if (!foundUser) throw new NotFoundExceptionMY(`Not found user with id: ${id}`);
    const foundBlog = await this.blogsRepositories.findBlog(blogId);
    if (!foundBlog) throw new NotFoundExceptionMY(`Not found blog with id: ${id}`);
    if (!foundBlog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    const foundBanStatus = await this.blogsRepositories.findStatusBanBy(userId, blogId);
    if (!foundBanStatus) {
      const newBanStatus = BlogBanInfo.createBan(blogId, userId, foundUser.id, foundUser.getLogin(), foundUser.getEmail());
      const banStatus = new this.blogBanInfoModel(newBanStatus);
      const savedBanStatus = await this.blogsRepositories.saveBanStatus(banStatus);
      if (isBanned === false) {
        savedBanStatus.unlockBanStatus();
        await this.blogsRepositories.saveBanStatus(savedBanStatus);
      } else {
        savedBanStatus.banBanStatus(banReason);
        await this.blogsRepositories.saveBanStatus(savedBanStatus);
      }
      return true;
    }
    if (isBanned === false) {
      foundBanStatus.unlockBanStatus();
      await this.blogsRepositories.saveBanStatus(foundBanStatus);
    } else {
      foundBanStatus.banBanStatus(banReason);
      await this.blogsRepositories.saveBanStatus(foundBanStatus);
    }
    return true;
  }
}


