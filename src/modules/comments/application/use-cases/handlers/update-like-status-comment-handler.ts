import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepositories } from "../../../infrastructure/comments.repositories";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdateLikeStatusCommentCommand } from "../update-like-status-comment-command";
import { InjectModel } from "@nestjs/mongoose";
import { LikeComment, LikeCommentDocument } from "../../../domain/likeComment-schema-Model";
import { Model } from "mongoose";

@CommandHandler(UpdateLikeStatusCommentCommand)
export class UpdateLikeStatusCommentHandler
  implements ICommandHandler<UpdateLikeStatusCommentCommand> {
  constructor(@InjectModel(LikeComment.name)
              private readonly likeCommentModel: Model<LikeCommentDocument>,
              private readonly commentsRepositories: CommentsRepositories) {
  }

  async execute(command: UpdateLikeStatusCommentCommand): Promise<boolean> {
    const { id, userId } = command;
    const { likeStatus } = command.updateLikeStatusInputModel;
    //finding comment by id from uri params
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (!comment)
      throw new NotFoundExceptionMY(`comment with specified id doesn't exists`);
    //finding likeComment for update like status
    const foundLikeComment = await this.commentsRepositories.findLikeComment(id, userId);
    if (!foundLikeComment) {
      const newLikeComment = LikeComment.createLikeComment(userId, id);
      const likeComment = new this.likeCommentModel(newLikeComment);
      const createdLikeComment = await this.commentsRepositories.saveLikeComment(likeComment);
      createdLikeComment.updateLikeComment(likeStatus);
      await this.commentsRepositories.saveLikeComment(createdLikeComment);
      return true;
    }
    foundLikeComment.updateLikeComment(likeStatus)
    await this.commentsRepositories.saveLikeComment(foundLikeComment)
    return true
  }
}
