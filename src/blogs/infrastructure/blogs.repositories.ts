import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from '../domain/blog-schema-Model';
import { BlogsDBType, CreateBlogDBModel } from './blog-View-Model';
import { ObjectId } from 'mongodb';
import { CreateBlogDtoModel } from '../api/create-Blog-Dto-Model';

@Injectable()
export class BlogsRepositories {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
  ) {}
  async createBlog(newBlog: CreateBlogDBModel): Promise<BlogsDBType> {
    const createdBlog = new this.blogsModel(newBlog);
    const a = await createdBlog.save();
    return a._id.toString();
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsModel
      .deleteOne({ _id: new ObjectId(id) })
      .exec();
    return result.deletedCount === 1;
  }
  async updateBlog(id: string, data: CreateBlogDtoModel): Promise<boolean> {
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
