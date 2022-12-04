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
import { PostsQueryRepositories } from "../infrastructure/posts-query.reposit";
import { CreatePostDto } from "./input-Dtos/create-Post-Dto-Model";
import { PaginationDto } from "../../blogs/api/input-Dtos/pagination-Dto-Model";
import { PaginationViewType } from "../../blogs/infrastructure/pagination-type";
import { PostViewModel } from "../infrastructure/post-View-Model";
import { CommentsQueryRepositories } from "../../comments/infrastructure/comments-query.repositories";
import { CommentsViewType } from "../../comments/infrastructure/comments-View-Model";


@Controller(`posts`)
export class PostsController {
  constructor(protected postsService: PostsService,
              protected postsQueryRepositories: PostsQueryRepositories,
              protected commentsQueryRepositories: CommentsQueryRepositories) {
  }

  @Get(":id/comments")
  async findComments(@Param("id") id: string, @Query() pagination: PaginationDto): Promise<PaginationViewType<CommentsViewType[]>>{
    const foundPost = await this.postsQueryRepositories.findPost(id);
    if(!foundPost) return null
    return this.commentsQueryRepositories.findCommentsWithPagination(id, pagination)
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto): Promise<PaginationViewType<PostViewModel[]>> {
    return  await this.postsQueryRepositories.findPosts(pagination);
  }

  @Post()
  async createPost(@Body() postInputModel: CreatePostDto): Promise<PostViewModel> {
    return this.postsService.createPost(postInputModel);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<PostViewModel | null> {
    return  await this.postsQueryRepositories.findPost(id);
  }

  @Put(`:id`)
  @HttpCode(204)
  async updateBlog(@Param("id") id: string, @Query() blogInputModel: CreatePostDto): Promise<boolean> {
    return await this.postsService.updatePost(id, blogInputModel);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<boolean> {
    return await this.postsService.removePost(id);
  }
}
