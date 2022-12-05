import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  Param,
  Post, Put,
  Query
} from "@nestjs/common";
import { PostsService } from "../domain/posts.service";
import { PostsQueryRepositories } from "../infrastructure/query-repositories/posts-query.reposit";
import { CreatePostDto } from "./input-Dtos/create-Post-Dto-Model";
import { PaginationDto } from "../../blogs/api/input-Dtos/pagination-Dto-Model";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";
import { PostViewModel } from "../infrastructure/query-repositories/post-View-Model";
import { CommentsQueryRepositories } from "../../comments/infrastructure/comments-query.repositories";
import { CommentsViewType } from "../../comments/infrastructure/comments-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";


@Controller(`posts`)
export class PostsController {
  constructor(protected postsService: PostsService,
              protected postsQueryRepositories: PostsQueryRepositories,
              protected commentsQueryRepositories: CommentsQueryRepositories) {
  }

  @Get(`:postId/comments`)
  async findComments(@Param(`postId`, IdValidationPipe) id: string,
                     @Query() pagination: PaginationDto): Promise<PaginationViewModel<CommentsViewType[]>> {
    await this.postsQueryRepositories.findPost(id);
    return this.commentsQueryRepositories.findCommentsWithPagination(id, pagination);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<PaginationViewModel<PostViewModel[]>> {
    return await this.postsQueryRepositories.findPosts(pagination);
  }

  @Post()
  async createPost(@Body() postInputModel: CreatePostDto): Promise<PostViewModel> {
    return this.postsService.createPost(postInputModel);
  }

  @Get(`:id`)
  async findOne(@Param(`id`, IdValidationPipe) id: string): Promise<PostViewModel> {
    return await this.postsQueryRepositories.findPost(id);
  }

  @Put(`:id`)
  @HttpCode(204)
  async updateBlog(@Param(`id`, IdValidationPipe) id: string,
                   @Body() postInputModel: CreatePostDto): Promise<boolean> {
    return await this.postsService.updatePost(id, postInputModel);
  }

  @Delete(`:id`)
  @HttpCode(204)
  async remove(@Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    return await this.postsService.removePost(id);
  }
}
