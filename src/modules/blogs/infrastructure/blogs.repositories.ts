import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from '../domain/blog-schema-Model';
import { ObjectId } from 'mongodb';
import { PreparationBlogForDB } from "../domain/blog-preparation-for-DB";
import { UpdateBlogDto } from "../api/input-Dtos/update-Blog-Dto-Model";

@Injectable()
export class BlogsRepositories {
  constructor(@InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>) {
  }

  async createBlog(newBlog: PreparationBlogForDB): Promise<string> {
    const createdBlog = new this.blogsModel(newBlog);
    const blog = await createdBlog.save();
    return blog._id.toString();
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsModel
      .deleteOne({ _id: new ObjectId(id) })
      .exec();
    return result.deletedCount === 1;
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<boolean> {
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
