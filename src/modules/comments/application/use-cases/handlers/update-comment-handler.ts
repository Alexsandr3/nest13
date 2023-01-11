import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepositories } from "../../../infrastructure/comments.repositories";
import { UpdateCommentCommand } from "../update-comment-command";
import { ForbiddenExceptionMY, NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly commentsRepositories: CommentsRepositories,
  ) {
  }

  async execute(command: UpdateCommentCommand) {
    const { id, userId } = command;
    const { content } = command.updateCommentInputModel;
    //finding comment by id from uri params
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`Not found content`);
    //checking comment
    if (!comment.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the comment`);
    //updating a comment
    comment.updateComment(content)
    //save updated comment
    await this.commentsRepositories.saveComment(comment)
    return true;
  }
}
