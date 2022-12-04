import { Body, Controller, Get, Query, Post, Param, Delete, Put, HttpCode } from "@nestjs/common";
import { BlogsService } from "../domain/blogs.service";
import { CreateBlogDto } from "./input-Dtos/create-Blog-Dto-Model";
import { BlogsQueryRepositories } from "../infrastructure/blogs-query.repositories";
import { BlogViewModel } from "../infrastructure/blog-View-Model";
import { PaginationDto } from "./input-Dtos/pagination-Dto-Model";
import { UpdateBlogDto } from "./input-Dtos/update-Blog-Dto-Model";
import { PaginationViewType } from "../infrastructure/pagination-type";
import { CreatePostByBlogIdDto } from "./input-Dtos/create-Post-By-BlogId-Dto-Model";
import { PostsQueryRepositories } from "../../posts/infrastructure/posts-query.reposit";


@Controller(`blogs`)
export class BlogsController {
  constructor(protected blogsService: BlogsService,
              protected blogsQueryRepositories: BlogsQueryRepositories,
              private postsQueryRepositories: PostsQueryRepositories) {
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<PaginationViewType<BlogViewModel[]>> {
    return await this.blogsQueryRepositories.findBlogs(pagination);
  }

  @Post()
  async createBlog(@Body() blogInputModel: CreateBlogDto): Promise<BlogViewModel | null> {
    const id = await this.blogsService.createBlog(blogInputModel);
    return this.blogsQueryRepositories.findBlog(id);
  }

  @Get(`:blogId/posts`)
  async findPosts(@Param("blogId") blogId: string, @Query() pagination: PaginationDto) {
    await this.blogsQueryRepositories.findBlog(blogId);
    return this.postsQueryRepositories.findPosts(pagination, blogId);
  }

  @Post(`:blogId/posts`)
  async createPost(@Param("blogId") blogId: string, @Body() postInputModel: CreatePostByBlogIdDto) {
    const blog = await this.blogsQueryRepositories.findBlog(blogId);
    return this.blogsService.createPost(postInputModel, blogId, blog.name);
  }

  @Get(":id")
  async findOne(@Param(`id`) id: string): Promise<BlogViewModel | null> {
    return await this.blogsQueryRepositories.findBlog(id);

  }

  @Put(`:id`)
  @HttpCode(204)
  async updateBlog(@Param("id") id: string, @Body() blogInputModel: UpdateBlogDto): Promise<boolean> {
    return await this.blogsService.updateBlog(id, blogInputModel);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<boolean> {
    return await this.blogsService.removeBlog(id);
  }
}
