import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../../domain/comments-schema-Model";
import { ObjectId } from "mongodb";
import { CommentsViewType, LikesInfoViewModel } from "../comments-View-Model";
import { LikeStatusType } from "../../../posts/domain/likesPost-schema-Model";
import { PaginationDto } from "../../../blogs/api/input-Dtos/pagination-Dto-Model";
import { CommentsDBType } from "../../domain/comment-DB-Type";
import { PaginationViewModel } from "../../../blogs/infrastructure/query-repository/pagination-View-Model";
import { NotFoundExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";
import { LikesStatus, LikesStatusDocument } from "../../domain/likesStatus-schema-Model";

@Injectable()
export class CommentsQueryRepositories {
  constructor(@InjectModel(Comment.name) private readonly commentsModel: Model<CommentDocument>,
              @InjectModel(LikesStatus.name) private readonly likesStatusModel: Model<LikesStatusDocument>) {
  }


  async findComments(commentId: string, userId: string | null): Promise<CommentsViewType> {
    let myStatus: string = LikeStatusType.None
    if (userId) {
      const result = await this.likesStatusModel.findOne({ userId: userId, parentId: commentId })
      if (result) {
        myStatus = result.likeStatus
      }
    }
    const totalCountLike = await this.likesStatusModel.countDocuments({ parentId: commentId, likeStatus: "Like" })
    const totalCountDislike = await this.likesStatusModel.countDocuments({ parentId: commentId, likeStatus: "Dislike" })
    if (!myStatus) return null
    const likesInfo = new LikesInfoViewModel(
      totalCountLike,
      totalCountDislike,
      myStatus)
    //search comment
    const result = await this.commentsModel.findOne({ _id: new ObjectId(commentId) })
    if (!result) {
      throw new NotFoundExceptionMY(`Not found for commentId${commentId}`);
    } else {
      //mapped comment for View
      return new CommentsViewType(
        result._id?.toString(),
        result.content,
        result.userId,
        result.userLogin,
        result.createdAt,
        likesInfo)
    }
  }

  private commentWithNewId(comment: CommentsDBType): CommentsViewType {
    /*let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await LikeModelClass.findOne({ userId: userId, parentId: comment._id });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const totalCountLike = await LikeModelClass.countDocuments({ parentId: comment._id, likeStatus: "Like" });
    const totalCountDislike = await LikeModelClass.countDocuments({ parentId: comment._id, likeStatus: "Dislike" });*/
    const likesInfo = new LikesInfoViewModel(
      0,
      0,
      LikeStatusType.None);
    //mapped comment for View
    return new CommentsViewType(
      comment._id.toString(),
      comment.content,
      comment.userId,
      comment.userLogin,
      comment.createdAt,
      likesInfo);
  }

  async findCommentsWithPagination(postId: string, data: PaginationDto): Promise<PaginationViewModel<CommentsViewType[]>> {
    //search all comments for post by postId with pagination
    const comments = await this.commentsModel.find({ postId: postId })
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection }).lean();
    //mapped comments for view
    const mappedComments = comments.map(comment => this.commentWithNewId(comment));
    //counting comments
    const totalCountComments = await this.commentsModel.countDocuments(postId ? { postId } : {});
    //pages count
    const pagesCountRes = Math.ceil(totalCountComments / data.pageSize);
    // Found comments with pagination
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCountComments,
      mappedComments
    );
  }

}
