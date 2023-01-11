import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { PostsRepositories } from "../../../infrastructure/posts-repositories";
import { UpdateLikeStatusCommand } from "../update-like-status-command";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { LikePost, LikePostDocument } from "../../../domain/likePost-schema-Model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler
  implements ICommandHandler<UpdateLikeStatusCommand> {
  constructor(
    @InjectModel(LikePost.name)
    private readonly likePostModel: Model<LikePostDocument>,
    private readonly postsRepositories: PostsRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  async execute(command: UpdateLikeStatusCommand): Promise<boolean> {
    const { id, userId } = command;
    const { likeStatus } = command.updateLikeStatusInputModel;
    //finding post by id from uri params
    const post = await this.postsRepositories.findPost(id);
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    //finding user by userId for update like status
    const user = await this.usersRepositories.findUserByIdWithMapped(userId);
    //finding likePost for update like status
    const foundLikePost = await this.postsRepositories.findLikePost(id, userId);
    if (!foundLikePost) {
      const newLikePost = LikePost.createLikePost(userId, id, user.getLogin());
      const likePost = new this.likePostModel(newLikePost)
      const createdLikePost = await this.postsRepositories.saveLikePost(likePost)
      createdLikePost.updateLikePost(likeStatus)
      await this.postsRepositories.saveLikePost(createdLikePost)
      return true
    }
    foundLikePost.updateLikePost(likeStatus)
    await this.postsRepositories.saveLikePost(foundLikePost)
    return true
  }
}
