import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {  Model } from "mongoose";
import { Post, PostDocument } from "../domain/post-schema-Model";
import { PreparationPostForDB } from "../domain/post-preparation-for-DB";
import { LikesPostsStatus, LikesPostsStatusDocument } from "../domain/likesPost-schema-Model";
import { ObjectId } from "mongodb";
import { CreatePostDto } from "../api/input-Dtos/create-Post-Dto-Model";
import { PostDBType } from "../domain/post-DB-Type";

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(LikesPostsStatus.name) private readonly likesPostsStatusModel: Model<LikesPostsStatusDocument>
  ) {
  }

  async createPost(newPost: PreparationPostForDB): Promise<PostDBType> {
    const post = await this.postModel.create(newPost);
    if (!post) throw new Error('not today server all (')
    return post
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
    if(!post) return null
    return post;
  }

  async updateStatusPostById(id: string, userId: string, likeStatus: string, login: string): Promise<boolean> {
    const like = await this.likesPostsStatusModel.updateOne(
      { userId: userId, parentId: id },
      { $set: { likeStatus: likeStatus, addedAt: new Date().toISOString(), login: login } },
      { upsert: true });
    if (!like) return null
    return true;
  }

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
