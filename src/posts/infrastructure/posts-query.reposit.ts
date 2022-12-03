import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from '../models/blog-schema';
import { BlogsDBType } from '../models/blogViewModel';
import { PaginationDto } from '../dto/pagination-Dto-Model';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
  ) {}

  async findBlogs(data: PaginationDto): Promise<BlogsDBType[]> {
    const fondBlogs = await this.blogsModel
      .find(
        data.searchNameTerm
          ? { name: { $regex: data.searchNameTerm, $options: 'i' } }
          : {},
      )
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    return fondBlogs;
  }

  async countDocuments(data: PaginationDto): Promise<number> {
    const count = this.blogsModel.countDocuments(
      data.searchNameTerm
        ? {
            name: {
              $regex: data.searchNameTerm,
              $options: 'i',
            },
          }
        : {},
    );
    return count;
  }

  async findBlog(id: string): Promise<BlogsDBType | null> {
    console.log('id', id);
    const blog = await this.blogsModel.findOne({ _id: new ObjectId(id) });
    return blog;
  }
}
