import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../domain/comments-schema-Model";
import { ObjectId } from "mongodb";
import { LikeStatusType } from "../../posts/domain/likePost-schema-Model";
import {
  LikeComment,
  LikeCommentDocument
} from "../domain/likeComment-schema-Model";
import { CommentsViewType, LikesInfoViewModel } from "./query-repository/comments-View-Model";

@Injectable()
export class CommentsRepositories {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name)
    private readonly likeCommentModel: Model<LikeCommentDocument>
  ) {
  }

  async saveComment(newComment: CommentDocument): Promise<CommentsViewType> {
    // const createComment = await this.commentsModel.create(newComment);
    const createdComment = await newComment.save();
    //default items
    const likesInfo = new LikesInfoViewModel(0, 0, LikeStatusType.None);
    //returning comment for View
    return new CommentsViewType(
      createdComment.id,
      newComment.content,
      newComment.userId,
      newComment.userLogin,
      newComment.createdAt,
      likesInfo
    );
  }

  async saveLikeComment(newLikeComment: LikeCommentDocument): Promise<LikeCommentDocument> {
    return await newLikeComment.save();
  }

  async findCommentsById(id: string): Promise<CommentDocument> {
    return this.commentsModel.findOne({ _id: new ObjectId(id) });
  }

  async deleteCommentsById(id: string): Promise<boolean> {
    const result = await this.commentsModel.deleteOne({
      _id: new ObjectId(id)
    });
    return result.deletedCount === 1;
  }

  async updateStatusBanComments(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.commentsModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } }
    );
    return result.matchedCount === 1;
  }

  async findLikeComment(id: string, userId: string): Promise<LikeCommentDocument> {
    return this.likeCommentModel.findOne({ userId: userId, parentId: id });
  }

  async updateStatusBanLike(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.likeCommentModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } }
    );
    return result.matchedCount === 1;
  }

}

/*async updateLikeStatusForComment(id: string, userId: string, likeStatus: LikeStatusType): Promise<boolean> {
    try {
      await this.likeCommentModel.updateOne(
        { userId: userId, parentId: id },
        { $set: { likeStatus, isBanned: false } },
        { upsert: true }
      );
      return true;
    } catch (error) {
      throw new Error(`not today - ! :-(`);
    }
  }

  async updateCommentsById(id: string, content: string): Promise<boolean> {
    const result = await this.commentsModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: content } }
    );
    return result.matchedCount === 1;
  }
*/