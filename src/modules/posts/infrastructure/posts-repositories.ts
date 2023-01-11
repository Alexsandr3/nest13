import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post, PostDocument } from "../domain/post-schema-Model";
import {
  LikePost,
  LikePostDocument
} from "../domain/likePost-schema-Model";
import { ObjectId } from "mongodb";

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(LikePost.name)
    private readonly likePostModel: Model<LikePostDocument>
  ) {
  }

  async savePost(newPost: PostDocument): Promise<PostDocument> {
    const post = await newPost.save();
    if (!post) throw new Error("not today server all (");
    return post;
  }

  async saveLikePost(newLikePost: LikePostDocument): Promise<LikePostDocument> {
    const likePost = await newLikePost.save();
    if (!likePost) throw new Error("not today server all (");
    return likePost;
  }

  async getPost(id: string, userId: string): Promise<PostDocument> {
    const result = await this.postModel.findOne(
      { _id: new ObjectId(id), userId: userId }
    );
    if (!result) return null;
    return result;
  }

  async deletePost(id: string, userId: string): Promise<boolean> {
    const result = await this.postModel
      .deleteOne({ _id: new ObjectId(id), userId: userId })
      .exec();
    return result.deletedCount === 1;
  }

  async findPost(id: string): Promise<PostDocument> {
    const post = await this.postModel.findOne({ _id: new ObjectId(id) });
    if (!post) return null;
    return post;
  }

  async updateStatusBanPostForUser(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.postModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } }
    );
    return result.matchedCount === 1;
  }

  async updateStatusBanPostForBlogger(blogId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.postModel.updateMany(
      { blogId },
      { $set: { isBanned: isBanned } }
    );
    return result.matchedCount === 1;
  }

  async findLikePost(id: string, userId: string): Promise<LikePostDocument> {
    return this.likePostModel.findOne({ userId: userId, parentId: id });
  }

  async updateStatusBanLikePost(userId: string, isBanned: boolean): Promise<boolean> {
    const result = await this.likePostModel.updateMany(
      { userId: userId },
      { $set: { isBanned: isBanned } }
    );
    return result.matchedCount === 1;
  }

}

/*  async createPost(newPost: PreparationPostForDB): Promise<PostDBType> {
    const post = await this.postModel.create(newPost);
    if (!post) throw new Error("not today server all (");
    return post;
  }

  async updatePost(id: string, data: CreatePostDto, blogId: string, userId: string): Promise<boolean> {
    const result = await this.postModel.updateOne(
      { _id: new ObjectId(id), userId: userId },
      {
        $set: {
          title: data.title,
          shortDescription: data.shortDescription,
          content: data.content,
          blogId: blogId
        }
      }
    );
    return result.matchedCount === 1;
  }

  async updateLikeStatusPost(id: string, userId: string, likeStatus: string, login: string): Promise<boolean> {
    const like = await this.likePostModel.updateOne(
      { userId: userId, parentId: id },
      {
        $set: {
          likeStatus: likeStatus,
          addedAt: new Date().toISOString(),
          login: login,
          isBanned: false
        }
      },
      { upsert: true }
    );
    if (!like) return null;
    return true;
  }*/
