import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LeanDocument, Model } from "mongoose";
import { Post, PostDocument } from "../../domain/post-schema-Model";
import { PaginationDto } from "../../../blogs/api/input-Dtos/pagination-Dto-Model";
import { PostDBType } from "../../domain/post-DB-Type";
import { PostViewModel } from "./post-View-Model";
import { LikesPostsStatus, LikesPostsStatusDocument, LikeStatusType } from "../../domain/likesPost-schema-Model";
import { ExtendedLikesInfoViewModel, LikeDetailsViewModel } from "./likes-Info-View-Model";
import { PaginationViewModel } from "../../../blogs/infrastructure/query-repository/pagination-View-Model";
import { ObjectId } from "mongodb";
import { NotFoundExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";
import { Comment, CommentDocument } from "../../../comments/domain/comments-schema-Model";
import { CommentsDBType } from "../../../comments/domain/comment-DB-Type";
import { LikesStatus, LikesStatusDocument } from "../../../comments/domain/likesStatus-schema-Model";
import { CommentsViewType, LikesInfoViewModel } from "../../../comments/infrastructure/comments-View-Model";





@Injectable()
export class PostsQueryRepositories {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
              @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
              @InjectModel(LikesStatus.name) private readonly likesStatusModel: Model<LikesStatusDocument>,
              @InjectModel(LikesPostsStatus.name) private readonly likesPostsStatusModel: Model<LikesPostsStatusDocument>) {
  }

  private async LikeDetailsView(object: LeanDocument<LikesPostsStatusDocument>): Promise<LikeDetailsViewModel> {
    return new LikeDetailsViewModel(
      object.addedAt,
      object.userId,
      object.login
    );
  }

  private async commentWithNewId(comment: CommentsDBType, userId: string | null): Promise<CommentsViewType> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likesStatusModel.findOne({ userId: userId, parentId: comment._id });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const totalCountLike = await this.likesStatusModel.countDocuments({ parentId: comment._id, likeStatus: "Like" });
    const totalCountDislike = await this.likesStatusModel.countDocuments({ parentId: comment._id, likeStatus: "Dislike" });
    const likesInfo = new LikesInfoViewModel(
      totalCountLike,
      totalCountDislike,
      myStatus);
    return new CommentsViewType(
      comment._id.toString(),
      comment.content,
      comment.userId,
      comment.userLogin,
      comment.createdAt,
      likesInfo);
  }

  private async _postForView(post: PostDBType, userId: string | null): Promise<PostViewModel> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likesPostsStatusModel.findOne({ userId: userId, parentId: post._id });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const totalCountLike = await this.likesPostsStatusModel.countDocuments({ parentId: post._id, likeStatus: "Like" });
    const totalCountDislike = await this.likesPostsStatusModel.countDocuments({ parentId: post._id, likeStatus: "Dislike" });
    const newestLikes = await this.likesPostsStatusModel
      .find({ parentId: post._id.toString(), likeStatus: "Like" })
      .sort({ addedAt: "desc" })
      .limit(3)
      .lean();
    const mappedNewestLikes = newestLikes.map(async like => await this.LikeDetailsView(like));
    const itemsLikes = await Promise.all(mappedNewestLikes);
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(
      totalCountLike,
      totalCountDislike,
      myStatus,
      itemsLikes
    );
    return new PostViewModel(
      post._id.toString(),
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.blogName,
      post.createdAt,
      extendedLikesInfo
    );
  }

  async findPosts(data: PaginationDto, userId: string | null, blogId?: string): Promise<PaginationViewModel<PostViewModel[]>> {
    /* let filter = {};
     if (blogId) { filter = { blogId: blogId }}*/
    //search all posts with pagination
    const foundPosts = await this.postModel
      .find(blogId ? { blogId } : {})
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped posts for view
    const mappedPosts = foundPosts.map(post => this._postForView(post, userId));
    const itemsPosts = await Promise.all(mappedPosts)
    //counting posts for blogId
    const totalCount = await this.postModel.countDocuments(blogId ? { blogId } : {});
    //pages count
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found posts with pagination
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      itemsPosts
    );
  }

  async findPost(id: string, userId: string | null): Promise<PostViewModel> {
    const post = await this.postModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    } else {
      //return post for View
      return this._postForView(post, userId);
    }
  }

  async findCommentsByIdPost(postId: string, data: PaginationDto, userId: string | null) {
    const post = await this.findPost(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${postId}`);
    const comments = await this.commentModel.find({ postId: postId })
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection }).lean();
    const mappedComments = comments.map(async comment => await this.commentWithNewId(comment, userId));
    const itemsComments = await Promise.all(mappedComments);
    const totalCountComments = await this.commentModel.countDocuments(postId ? { postId } : {});
    const pagesCountRes = Math.ceil(totalCountComments / data.pageSize);
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCountComments,
      itemsComments
    );
  }
}
