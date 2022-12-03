import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from '../domain/blog-schema-Model';
import { BlogsDBType } from './blog-View-Model';
import { PaginationDto } from '../dto/pagination-Dto-Model';
import { ObjectId } from 'mongodb';
import { PostsController } from '../../posts/api/posts.controller';

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    /*  @Inject(forwardRef(() => PostsController))
    private postsController: PostsController,*/
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
    const blog = await this.blogsModel.findOne({ _id: new ObjectId(id) });
    return blog;
  }
}
