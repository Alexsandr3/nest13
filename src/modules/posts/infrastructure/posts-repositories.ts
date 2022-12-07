import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "../domain/post-schema-Model";
import {
  ExtendedLikesInfoViewModel
} from "./query-repositories/likes-Info-View-Model";
import { PreparationPostForDB } from "../domain/post-preparation-for-DB";
import { PostViewModel } from "./query-repositories/post-View-Model";
import { LikeStatusType } from "../domain/likesPost-schema-Model";
import { ObjectId } from "mongodb";
import { CreatePostDto } from "../api/input-Dtos/create-Post-Dto-Model";
import { PostDBType } from "../domain/post-DB-Type";

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
   /* @InjectModel(LikesPostsStatus.name)
    private readonly likesPostsStatusModel: Model<LikesPostsStatusDocument>*/
  ) {
  }

  /*  private _LikeDetailsView(object: LikesPostsDBType): LikeDetailsViewModel {
      return new LikeDetailsViewModel(
        object.addedAt,
        object.userId,
        object.login,
      );
    }*/
  async createPost(newPost: PreparationPostForDB): Promise<PostViewModel> {
    const post = await this.postModel.create(newPost);
    if (!post) return null;
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

  async deletePost(id: string): Promise<boolean> {
    const result = await this.postModel
      .deleteOne({ _id: new ObjectId(id) })
      .exec();
    return result.deletedCount === 1;
  }

  async updatePost(id: string, data: CreatePostDto): Promise<boolean> {
    const result = await this.postModel.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId
      }
    });
    return result.matchedCount === 1;
  }

  async findPost(id: string): Promise<PostDBType> {
    const post = await this.postModel.findOne({ _id: new ObjectId(id) });
    return post;
  }

  /*async updateStatusPostById(id: string, user: UsersViewType, likeStatus: LikeStatusType): Promise<boolean> {
    const like = await this.likesPostsStatusModel.updateOne(
      { userId: user.id, parentId: id },
      { $set: { likeStatus: likeStatus, addedAt: new Date().toISOString(), login: user.login } },
      { upsert: true });
    if (!like) return false;
    return true;
  }*/


  /*async createComment(post_id: ObjectId, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
    const newComment = new CommentsDBType(
      new ObjectId(),
      post_id.toString(),
      content,
      userId,
      userLogin,
      new Date().toISOString())
    const createComment = await CommentModelClass.create(newComment)
    if (!createComment) return null
    const likesInfo = new LikesInfoViewModel(
      0,
      0,
      LikeStatusType.None)
    return new CommentsViewType(
      newComment._id?.toString(),
      newComment.content,
      newComment.userId,
      newComment.userLogin,
      newComment.createdAt,
      likesInfo)
  }*/
}
