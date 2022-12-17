import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { BlogDocument, Blog } from "../../../blogger/domain/blog-schema-Model";
import {
  BlogOwnerInfoType,
  BlogViewForSaModel,
  BlogViewModel
} from "./blog-View-Model";
import { PaginationViewModel } from "./pagination-View-Model";
import { BlogsDBType } from "../../../blogger/domain/blog-DB-Type";
import { PaginationDto } from "../../api/input-Dtos/pagination-Dto-Model";
import { NotFoundExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>
  ) {
  }

  private mapperBlogForView(object: BlogsDBType): BlogViewModel {
    return new BlogViewModel(
      object._id.toString(),
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt
    );
  }

  private mapperBlogForSaView(object: BlogsDBType): BlogViewForSaModel {
    const blogOwnerInfo = new BlogOwnerInfoType(
      object.userId,
      object.userLogin
    );
    return new BlogViewForSaModel(
      object._id.toString(),
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt,
      blogOwnerInfo
    );
  }

  async findBlogs(data: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } = data;
    //search all blogs
    const foundBlogs = await this.blogsModel
      .find(searchNameTerm? { name: { $regex: searchNameTerm, $options: "i" } }: {})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperBlogForView(blog));
    //counting blogs
    const totalCount = await this.blogsModel.countDocuments(searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } } : {});
    const pagesCountRes = Math.ceil(totalCount / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      pageNumber,
      pageSize,
      totalCount,
      mappedBlogs
    );
  }

  async findBlogsForSa(data: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    console.log(data);
    const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } = data;
    //search all blogs
    const foundBlogs = await this.blogsModel
      .find(searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" } } : {})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperBlogForSaView(blog));
    //counting blogs
    const totalCount = await this.blogsModel.countDocuments(
      searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" } } : {});
    const pagesCountRes = Math.ceil(totalCount / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      pageNumber,
      pageSize,
      totalCount,
      mappedBlogs
    );
  }

  async findBlogsForCurrentBlogger(data: PaginationDto, userId: string): Promise<PaginationViewModel<BlogViewModel[]>> {
    const {searchNameTerm, pageSize, pageNumber, sortDirection, sortBy} = data
    const filter: FilterQuery<Blog> = { userId: userId };
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    //search all blogs for current user
    const foundBlogs = await this.blogsModel
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperBlogForView(blog));
    //counting blogs user
    const totalCount = await this.blogsModel.countDocuments(filter);
    const pagesCountRes = Math.ceil(totalCount / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      pageNumber,
      pageSize,
      totalCount,
      mappedBlogs
    );
  }

  async findBlog(id: string): Promise<BlogViewModel> {
    const blog = await this.blogsModel.findOne({ id });
    if (!blog) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    //returning Blog for View
    return this.mapperBlogForView(blog);
  }
}
