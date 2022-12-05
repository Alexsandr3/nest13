import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BlogDocument, Blog } from "../../domain/blog-schema-Model";
import { BlogViewModel } from "./blog-View-Model";
import { ObjectId } from "mongodb";
import { PaginationViewModel } from "./pagination-View-Model";
import { BlogsDBType } from "../../domain/blog-DB-Type";
import { PaginationDto } from "../../api/input-Dtos/pagination-Dto-Model";
import { NotFoundExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";


@Injectable()
export class BlogsQueryRepositories {
  constructor(@InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>
  ) {
  }

  private mapperForBlogView(object: BlogsDBType): BlogViewModel {
    return new BlogViewModel(
      object._id.toString(),
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt
    );
  }

  async findBlogs(data: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    //search all blogs
    const foundBlogs = await this.blogsModel
      .find(data.searchNameTerm ? { name: { $regex: data.searchNameTerm, $options: "i" } } : {})
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection })
      .lean();
    //mapped for View
    const mappedBlogs = foundBlogs.map((blog) => this.mapperForBlogView(blog));
    //counting blogs with pagination
    const totalCount = await this.blogsModel
      .countDocuments(data.searchNameTerm ? { name: { $regex: data.searchNameTerm, $options: "i" } } : {});
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found Blogs with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      mappedBlogs
    );
  }

  async findBlog(id: string): Promise<BlogViewModel> {
    const blog = await this.blogsModel.findOne({ _id: new ObjectId(id) });
    if (!blog) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    //returning Blog for view
    return this.mapperForBlogView(blog);
  }
}

