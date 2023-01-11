import { UsersRepositories } from '../../../infrastructure/users-repositories';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBanInfoCommand } from '../updateBanInfoCommand';
import {
  NotFoundExceptionMY,
} from '../../../../../helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../../posts/infrastructure/posts-repositories';
import { CommentsRepositories } from '../../../../comments/infrastructure/comments.repositories';

@CommandHandler(UpdateBanInfoCommand)
export class UpdateBanInfoHandler
  implements ICommandHandler<UpdateBanInfoCommand>
{
  constructor(
    private readonly usersRepositories: UsersRepositories,
    private readonly postsRepositories: PostsRepositories,
    private readonly commentsRepositories: CommentsRepositories,
  ) {}

  async execute(command: UpdateBanInfoCommand): Promise<boolean> {
    const { userId } = command;
    const { isBanned, banReason } = command.updateBanInfoModel;
    const user = await this.usersRepositories.findUserByIdWithMapped(userId);
    if (!user) throw new NotFoundExceptionMY(`Not found `);
    if(!user.checkStatusBan()){
      user.unblockUser()
      await this.usersRepositories.saveUser(user)
      //update status ban posts for User
      await this.postsRepositories.updateStatusBanPostForUser(userId, isBanned);
      //update status ban likes post
      await this.postsRepositories.updateStatusBanLikePost(userId, isBanned);
      //update status ban comments
      await this.commentsRepositories.updateStatusBanComments(userId, isBanned);
      //update status ban likes comments
      await this.commentsRepositories.updateStatusBanLike(userId, isBanned);
    } else {
      user.banUser(banReason)
      await this.usersRepositories.saveUser(user)
      //update status ban likes post
      await this.postsRepositories.updateStatusBanPostForUser(userId, isBanned);
      //update status ban likes post
      await this.postsRepositories.updateStatusBanLikePost(userId, isBanned);
      //update status ban comments
      await this.commentsRepositories.updateStatusBanComments(userId, isBanned);
      //update status ban likes comments
      await this.commentsRepositories.updateStatusBanLike(userId, isBanned);
    }
    return true;
  }
}
