import {
  Body, Controller, Get, Query, Post, Param, Delete, Put, HttpCode, UseGuards
} from "@nestjs/common";
import { CreateBlogDto } from "./input-Dtos/create-Blog-Dto-Model";
import { UpdateBlogDto } from "./input-Dtos/update-Blog-Dto-Model";
import { CreatePostByBlogIdDto } from "../../posts/api/input-Dtos/create-Post-By-BlogId-Dto-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { PostViewModel } from "../../posts/infrastructure/query-repositories/post-View-Model";
import { CommandBus } from "@nestjs/cqrs";
import { CreateBlogCommand } from "../application/use-cases/create-blog-command";
import { DeleteBlogCommand } from "../application/use-cases/delete-blog-command";
import { UpdateBlogCommand } from "../application/use-cases/update-blog-command";
import { CreatePostCommand } from "../application/use-cases/create-post-command";
import { BlogsQueryRepositories } from "../../blogs/infrastructure/query-repository/blogs-query.repositories";
import { JwtAuthGuard } from "../../../guards/jwt-auth-bearer.guard";
import { PaginationDto } from "../../blogs/api/input-Dtos/pagination-Dto-Model";
import { BlogViewModel } from "../../blogs/infrastructure/query-repository/blog-View-Model";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";
import { UpdatePostCommand } from "../application/use-cases/update-post-command";
import { DeletePostCommand } from "../application/use-cases/delete-post-command";
import { CurrentUserIdBlogger } from "../../../decorators/current-user-id.param.decorator";

@UseGuards(JwtAuthGuard)
@Controller(`blogger/blogs`)
export class BloggersController {
  constructor(private readonly blogsQueryRepositories: BlogsQueryRepositories,
              private commandBus: CommandBus
  ) {
  }

  @HttpCode(204)
  @Delete(`:blogId`)
  async deleteBlog(@CurrentUserIdBlogger() userId: string,
                   @Param(`blogId`, IdValidationPipe) blogId: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }

  @HttpCode(204)
  @Put(`:blogId`)
  async updateBlog(@CurrentUserIdBlogger() userId: string,
                   @Param(`blogId`, IdValidationPipe) blogId: string,
                   @Body() blogInputModel: UpdateBlogDto): Promise<boolean> {
    return await this.commandBus.execute(new UpdateBlogCommand(userId, blogId, blogInputModel));
  }

  @Post(`:blogId/posts`)
  async createPost(@CurrentUserIdBlogger() userId: string,
                   @Param(`blogId`, IdValidationPipe) blogId: string,
                   @Body() postInputModel: CreatePostByBlogIdDto): Promise<PostViewModel> {
    return this.commandBus.execute(new CreatePostCommand(postInputModel, blogId, userId));
  }

  @HttpCode(204)
  @Put(`:blogId/posts/:postId`)
  async updatePost(@CurrentUserIdBlogger() userId: string,
                   @Param(`blogId`, IdValidationPipe) blogId: string,
                   @Param(`postId`, IdValidationPipe) postId: string,
                   @Body() postInputModel: CreatePostByBlogIdDto): Promise<boolean> {
    return await this.commandBus.execute(new UpdatePostCommand(userId, blogId, postId, postInputModel));
  }

  @Delete(`:blogId/posts/:postId`)
  @HttpCode(204)
  async deletePost(@CurrentUserIdBlogger() userId: string,
                   @Param(`blogId`, IdValidationPipe) blogId: string,
                   @Param(`postId`, IdValidationPipe) postId: string): Promise<boolean> {
    return await this.commandBus.execute(new DeletePostCommand(userId, blogId, postId));
  }

  @Post()
  async createBlog(@CurrentUserIdBlogger() userId: string,
                   @Body() blogInputModel: CreateBlogDto): Promise<BlogViewModel> {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(userId, blogInputModel));
    return this.blogsQueryRepositories.findBlog(blogId);
  }

  @Get()
  async findAll(@CurrentUserIdBlogger() userId: string,
                @Query() paginationInputModel: PaginationDto): Promise<PaginationViewModel<BlogViewModel[]>> {
    return await this.blogsQueryRepositories.findBlogsForCurrentUser(paginationInputModel, userId);
  }
}
