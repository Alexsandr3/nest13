import { Injectable } from '@nestjs/common';
import { BlogsRepositories } from '../infrastructure/blogs-repositories';
import { CreateBlogDto } from '../dto/create-Blog-Dto-Model';
import {
  mapperForBlogViewModel,
  CreateBlogDBModel,
} from '../models/blogViewModel';
import { CreatePostByBlogIdDto } from '../dto/create-Post-By-BlogId-Dto-Model';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepositories: BlogsRepositories) {}

  async createBlog(
    blogInputModel: CreateBlogDto,
  ): Promise<mapperForBlogViewModel> {
    const newBlog = new CreateBlogDBModel(
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
      new Date().toISOString(),
    );
    const blog = await this.blogsRepositories.createBlog(newBlog);
    return new mapperForBlogViewModel(blog);
  }

  async removeBlog(id: string): Promise<boolean> {
    return await this.blogsRepositories.deleteBlog(id);
  }
  async updateBlog(
    id: string,
    blogInputModel: CreateBlogDto,
  ): Promise<boolean> {
    return await this.blogsRepositories.updateBlog(id, blogInputModel);
  }

  async createPost(postInputModel: CreatePostByBlogIdDto, blogId: string) {
    return;
  }
}
