import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "../../domain/post-schema-Model";
import { PaginationDto } from "../../../blogs/api/input-Dtos/pagination-Dto-Model";
import { PostDBType } from "../../domain/post-DB-Type";
import { PostViewModel } from "./post-View-Model";
import { LikeStatusType } from "../../domain/likesPost-schema-Model";
import { ExtendedLikesInfoViewModel } from "./likes-Info-View-Model";
import { PaginationViewModel } from "../../../blogs/infrastructure/query-repository/pagination-View-Model";
import { ObjectId } from "mongodb";
import { NotFoundExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";

@Injectable()
export class PostsQueryRepositories {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>
              /* @InjectModel(LikesPostsStatus.name) private readonly likesPostsStatusModel: Model<LikesPostsStatusDocument>*/) {
  }

  /*private async LikeDetailsView(object: LikesPostsDBType): Promise<LikeDetailsViewModel> {
    return new LikeDetailsViewModel(
      object.addedAt,
      object.userId,
      object.login
    );
  }*/

  private _postForView(post: PostDBType): PostViewModel {
    /*let myStatus: string = LikeStatusType.None
    if (userId) {
      const result = await this.likesPostsStatusModel.findOne({userId: userId, parentId: post._id})
      if (result) {
        myStatus = result.likeStatus
      }
    }
    const totalCountLike = await this.likesPostsStatusModel.countDocuments({parentId: post._id, likeStatus: "Like"})
    const totalCountDislike = await this.likesPostsStatusModel.countDocuments({parentId: post._id, likeStatus: "Dislike"})
    const newestLikes = await this.likesPostsStatusModel
      .find({parentId: post._id.toString(), likeStatus: "Like"})
      .sort({addedAt: "desc"})
      .limit(3)
      .lean()

    const mappedNewestLikes = newestLikes.map(async like => await this.LikeDetailsView(like))
    const itemsLikes = await Promise.all(mappedNewestLikes)
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(
      totalCountLike,
      totalCountDislike,
      myStatus,
      itemsLikes
    )*/
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(
      0,
      0,
      LikeStatusType.None,
      []
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

  async findPosts(data: PaginationDto, blogId?: string): Promise<PaginationViewModel<PostViewModel[]>> {
    //search all posts with pagination
    const foundPosts = await this.postModel
      .find({blogId: blogId})
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped posts for view
    const mappedPosts = foundPosts.map(post => this._postForView(post));
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
      mappedPosts
    );
  }

  async findPost(id: string): Promise<PostViewModel> {
    const post = await this.postModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    } else {
      //return post for View
      return this._postForView(post);
    }
  }


}
