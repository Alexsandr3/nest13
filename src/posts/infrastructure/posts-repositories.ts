import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlogsDBType,
  CreateBlogDBModel,
  CreatePostDBModel,
} from '../models/postViewModel';
import { ObjectId } from 'mongodb';
import { CreateBlogDto } from '../dto/create-Post-Dto-Model';
import { Post, PostDocument } from '../models/post-schema';

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}
  async createPost(newPost: CreatePostDBModel): Promise<BlogsDBType> {
    const createdBlog = new this.postModel(newBlog);
    return createdBlog.save();
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsModel
      .deleteOne({ _id: new ObjectId(id) })
      .exec();
    return result.deletedCount === 1;
  }
  async updateBlog(id: string, data: CreateBlogDto): Promise<boolean> {
    const result = await this.blogsModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
        },
      },
    );
    return result.matchedCount === 1;
  }
}
