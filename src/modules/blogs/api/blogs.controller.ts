import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Param,
  Delete,
  Put,
  HttpCode, UseGuards
} from "@nestjs/common";
import { BlogsService } from "../domain/blogs.service";
import { CreateBlogDto } from "./input-Dtos/create-Blog-Dto-Model";
import { BlogsQueryRepositories } from "../infrastructure/query-repository/blogs-query.repositories";
import { BlogViewModel } from "../infrastructure/query-repository/blog-View-Model";
import { PaginationDto } from "./input-Dtos/pagination-Dto-Model";
import { UpdateBlogDto } from "./input-Dtos/update-Blog-Dto-Model";
import { PaginationViewModel } from "../infrastructure/query-repository/pagination-View-Model";
import { CreatePostByBlogIdDto } from "../../posts/api/input-Dtos/create-Post-By-BlogId-Dto-Model";
import { PostsQueryRepositories } from "../../posts/infrastructure/query-repositories/posts-query.reposit";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { PostViewModel } from "../../posts/infrastructure/query-repositories/post-View-Model";
import { BasicAuthGuard } from "../../auth/guard/basic-auth.guard";
import { CurrentUserId } from "../../auth/decorators/current-user-id.param.decorator";
import { JwtForGetGuard } from "../../auth/guard/jwt-auth-bearer-for-get.guard";


@Controller(`blogs`)
export class BlogsController {
  constructor(protected blogsService: BlogsService,
              protected blogsQueryRepositories: BlogsQueryRepositories,
              protected postsQueryRepositories: PostsQueryRepositories) {
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    return await this.blogsQueryRepositories.findBlogs(pagination);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() blogInputModel: CreateBlogDto): Promise<BlogViewModel> {
    const id = await this.blogsService.createBlog(blogInputModel);
    return this.blogsQueryRepositories.findBlog(id);
  }


  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(@CurrentUserId() userId: string,
                  @Param(`blogId`, IdValidationPipe) blogId: string,
                  @Query() pagination: PaginationDto): Promise<PaginationViewModel<PostViewModel[]>> {
    await this.blogsQueryRepositories.findBlog(blogId);
    return this.postsQueryRepositories.findPosts(pagination, userId, blogId);
  }

  @UseGuards(BasicAuthGuard)
  @Post(`:blogId/posts`)
  async createPost(@Param(`blogId`, IdValidationPipe) blogId: string,
                   @Body() postInputModel: CreatePostByBlogIdDto): Promise<PostViewModel> {
    const blog = await this.blogsQueryRepositories.findBlog(blogId);
    return this.blogsService.createPost(postInputModel, blogId, blog.name);
  }


  @Get(`:id`)
  async findOne(@Param(`id`, IdValidationPipe) id: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepositories.findBlog(id);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(`:id`)
  async updateBlog(@Param(`id`, IdValidationPipe) id: string,
                   @Body() blogInputModel: UpdateBlogDto): Promise<boolean> {
    return await this.blogsService.updateBlog(id, blogInputModel);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(`:id`)
  async remove(@Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    return await this.blogsService.removeBlog(id);
  }
}
