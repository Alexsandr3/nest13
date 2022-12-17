import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from '../../blogger/domain/blog-schema-Model';
import { PreparationBlogForDB } from '../../blogger/domain/blog-preparation-for-DB';
import { BlogsDBType } from '../../blogger/domain/blog-DB-Type';
import { UpdateBlogDto } from '../../blogger/api/input-dtos/update-Blog-Dto-Model';

@Injectable()
export class BlogsRepositories {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
  ) {}

  async createBlog(newBlog: PreparationBlogForDB): Promise<string> {
    const smartBlog = new this.blogsModel(newBlog);
    const blog = await smartBlog.save();
    return blog.id;
  }

  async deleteBlog(id: string, userId: string): Promise<boolean> {
    const result = await this.blogsModel
      .deleteOne({ id, userId: userId })
      .exec();
    return result.deletedCount === 1;
  }

  async updateBlog(id: string, userId: string, data: UpdateBlogDto,): Promise<boolean> {
    const result = await this.blogsModel.updateOne(
      { id, userId: userId },
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

  async findBlog(id: string): Promise<BlogsDBType> {
    const blog = await this.blogsModel.findOne({ id });
    if (!blog) return null;
    return blog;
  }

  async updateOwnerBlog(id: string, userId: string): Promise<boolean> {
    const result = await this.blogsModel.updateOne(
      { id },
      { $set: { userId: userId } },
    );
    return result.matchedCount === 1;
  }
}
