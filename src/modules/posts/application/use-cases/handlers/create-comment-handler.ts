import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepositories } from "../../../infrastructure/posts-repositories";
import { CreateCommentCommand } from "../create-comment-command";
import { CommentsViewType } from "../../../../comments/infrastructure/query-repository/comments-View-Model";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../../../helpers/My-HttpExceptionFilter";
import { UsersQueryRepositories } from "../../../../users/infrastructure/query-reposirory/users-query.reposit";
import { CommentsRepositories } from "../../../../comments/infrastructure/comments.repositories";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "../../../../comments/domain/comments-schema-Model";
import { Model } from "mongoose";

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentDocument>,
    private readonly postsRepositories: PostsRepositories,
    private readonly blogsRepositories: BlogsRepositories,
    private readonly commentsRepositories: CommentsRepositories,
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  async execute(command: CreateCommentCommand): Promise<CommentsViewType> {
    const { content } = command.inputCommentModel;
    const { id } = command;
    const { userId } = command;
    //find post for create comment
    const post = await this.postsRepositories.findPost(id);
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    const user = await this.usersRepositories.findUserByIdWithMapped(userId);
    //check status ban user
    const statusBan = await this.blogsRepositories.findStatusBan(userId, post.blogId);
    if (statusBan && statusBan.checkStatusBan()) {
      throw new ForbiddenExceptionMY(`For user comment banned`);
    }
    //preparation comment for save in DB
    const newComment = Comment.createComment(post.id, post.getOwnerPost(), content, userId, user.getLogin());
    //create instance
    const comment = new this.commentsModel(newComment);
    //save created instance and return for view
    return await this.commentsRepositories.saveComment(comment);
  }
}
