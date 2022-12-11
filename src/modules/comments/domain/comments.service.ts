import { Injectable } from "@nestjs/common";
import { CommentsRepositories } from "../infrastructure/comments.repositories";
import { LikeStatusType } from "../../posts/domain/likesPost-schema-Model";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../helpers/My-HttpExceptionFilter";


@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepositories: CommentsRepositories
  ) {
  }

  private async findComment(id: string, userId: string): Promise<boolean>{
    //finding comment by id from uri params
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`Not found content`);
    if (comment.userId !== userId) throw new ForbiddenExceptionMY(`You are not the owner of the comment`);
    return true
  }

  async updateLikeStatus(id: string, likeStatus: LikeStatusType, userId: string): Promise<boolean> {
    //finding comment by id from uri params
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`comment with specified id doesn't exists`);
    //update a like status for comment
    return this.commentsRepositories.updateStatusCommentById(id, userId, likeStatus);
  }

  async updateCommentsById(id: string, content: string, userId: string) {
    //finding and checking comment
    await this.findComment(id, userId)
    //updating a comment in DB
    const result = await this.commentsRepositories.updateCommentsById(id, content);
    if (!result) throw new Error(`not today`);
    return true;
  }

  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    //finding and checking comment
    await this.findComment(id, userId)
    //delete a comment from DB
    const result = await this.commentsRepositories.deleteCommentsById(id);
    if (!result) throw new Error(`not today`);
    return true;
  }

}
