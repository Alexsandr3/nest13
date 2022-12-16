import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BlogDocument, Blog } from '../../../blogger/domain/blog-schema-Model';
import {
  BlogOwnerInfoType,
  BlogViewForSaModel,
  BlogViewModel,
} from './blog-View-Model';
import { ObjectId } from 'mongodb';
import { PaginationViewModel } from './pagination-View-Model';
import { BlogsDBType } from '../../../blogger/domain/blog-DB-Type';
import { PaginationDto } from '../../api/input-Dtos/pagination-Dto-Model';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
  ) {}

  private mapperBlogForView(object: BlogsDBType): BlogViewModel {
    return new BlogViewModel(
      object._id.toString(),
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt,
    );
  }

  private mapperBlogForSaView(object: BlogsDBType): BlogViewForSaModel {
    const blogOwnerInfo = new BlogOwnerInfoType(
      object.userId,
      object.userLogin,
    );
    return new BlogViewForSaModel(
      object._id.toString(),
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt,
      blogOwnerInfo,
    );
  }

  async findBlogs(data: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    //search all blogs
    const foundBlogs = await this.blogsModel
      .find(
        data.searchNameTerm
          ? { name: { $regex: data.searchNameTerm, $options: 'i' } }
          : {},
      )
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperBlogForView(blog));
    //counting blogs
    const totalCount = await this.blogsModel.countDocuments(
      data.searchNameTerm
        ? { name: { $regex: data.searchNameTerm, $options: 'i' } }
        : {},
    );
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      mappedBlogs,
    );
  }

  async findBlogsForSa(data: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    //search all blogs
    const foundBlogs = await this.blogsModel
      .find(
        data.searchNameTerm
          ? { name: { $regex: data.searchNameTerm, $options: 'i' } }
          : {},
      )
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) =>
      this.mapperBlogForSaView(blog),
    );
    //counting blogs
    const totalCount = await this.blogsModel.countDocuments(
      data.searchNameTerm
        ? { name: { $regex: data.searchNameTerm, $options: 'i' } }
        : {},
    );
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      mappedBlogs,
    );
  }

  async findBlogsForCurrentBlogger(data: PaginationDto, userId: string): Promise<PaginationViewModel<BlogViewModel[]>> {
    const filter: FilterQuery<Blog> = { userId: userId };
    if (data.searchNameTerm) {
      filter.name = { $regex: data.searchNameTerm, $options: 'i' };
    }
    //search all blogs for current user
    const foundBlogs = await this.blogsModel
      .find(filter)
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperBlogForView(blog));
    //counting blogs user
    const totalCount = await this.blogsModel.countDocuments(filter);
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      mappedBlogs,
    );
  }

  async findBlog(id: string): Promise<BlogViewModel> {
    const blog = await this.blogsModel.findOne({ _id: new ObjectId(id) });
    if (!blog) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    //returning Blog for View
    return this.mapperBlogForView(blog);
  }
}
