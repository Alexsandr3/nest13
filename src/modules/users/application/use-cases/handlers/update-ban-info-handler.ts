import { UsersRepositories } from "../../../infrastructure/users-repositories";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateBanInfoCommand } from "../updateBanInfoCommand";
import { UsersQueryRepositories } from "../../../infrastructure/query-reposirory/users-query.reposit";
import { BadRequestExceptionMY, NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { PostsRepositories } from "../../../../posts/infrastructure/posts-repositories";
import { CommentsRepositories } from "../../../../comments/infrastructure/comments.repositories";


@CommandHandler(UpdateBanInfoCommand)
export class UpdateBanInfoHandler implements ICommandHandler<UpdateBanInfoCommand> {
  constructor(private readonly usersRepositories: UsersRepositories,
              private readonly usersQueryRepositories: UsersQueryRepositories,
              private readonly postsRepositories: PostsRepositories,
              private readonly commentsRepositories: CommentsRepositories) {
  }


  async execute(command: UpdateBanInfoCommand): Promise<boolean> {
    const { userId } = command;
    const { isBanned, banReason } = command.updateBanInfoModel;
    const user = await this.usersQueryRepositories.findUser(userId);
    if (!user) throw new NotFoundExceptionMY(`Not found `);
    if (isBanned === false) {
      const banDate = null;
      const banReason = null;
      const banInfo = await this.usersRepositories.updateBanInfo(userId, isBanned, banDate, banReason);
      if (!banInfo) throw new BadRequestExceptionMY({
        message: `New data not received for update`, field: `database`
      })
      await this.postsRepositories.updateStatusBan(userId, isBanned)
      await this.commentsRepositories.updateStatusBan(userId, isBanned)
    } else {
      const banDate = new Date().toISOString();
      await this.usersRepositories.updateBanInfo(userId, isBanned, banDate, banReason);
      await this.postsRepositories.updateStatusBan(userId, isBanned)
      await this.commentsRepositories.updateStatusBan(userId, isBanned)

      //comment , post by userId true
    }
    return true;
  }
}


