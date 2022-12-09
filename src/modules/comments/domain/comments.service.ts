import { Injectable } from "@nestjs/common";
import { CommentsRepositories } from "../infrastructure/comments.repositories";
import { LikeStatusType } from "../../posts/domain/likesPost-schema-Model";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../helpers/My-HttpExceptionFilter";


@Injectable()
export class CommentsService {
  constructor(protected commentsRepositories: CommentsRepositories
  ) {
  }


  async updateLikeStatus(id: string, likeStatus: LikeStatusType, userId: string): Promise<boolean> {
    const comment = await this.commentsRepositories.findCommentsById(id)
    if (!comment) throw new NotFoundExceptionMY(`comment with specified id doesn't exists`)
    return this.commentsRepositories.updateStatusCommentById(id, userId, likeStatus)
  }

  async updateCommentsById(id: string, content: string, userId: string) {
    const comment = await this.commentsRepositories.findCommentsById(id)
    if (!comment) {
      throw new NotFoundExceptionMY(`Not found content`)
    }
    if (comment.userId !== userId) {
     throw new ForbiddenExceptionMY(`You are not the owner of the comment`)
    }
    const result = await this.commentsRepositories.updateCommentsById(id, content)
    if (!result) {
      throw new Error(`not today`)
    }
    return true
  }

  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    const comment = await this.commentsRepositories.findCommentsById(id)
    if (!comment) {
      throw new NotFoundExceptionMY(`Not found content`)
    }
    if (comment.userId !== userId) {
      throw new ForbiddenExceptionMY(`You are not the owner of the comment`)
    }
    const result = await this.commentsRepositories.deleteCommentsById(id)
    if (!result) {
      throw new Error(`not today`)
    }
    return true
  }

}
