import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards
} from "@nestjs/common";
import { PostsService } from "../domain/posts.service";
import { PostsQueryRepositories } from "../infrastructure/query-repositories/posts-query.reposit";
import { CreatePostDto } from "./input-Dtos/create-Post-Dto-Model";
import { PaginationDto } from "../../blogs/api/input-Dtos/pagination-Dto-Model";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";
import { PostViewModel } from "../infrastructure/query-repositories/post-View-Model";
import { CommentsViewType } from "../../comments/infrastructure/comments-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { JwtAuthGuard } from "../../../guards/jwt-auth-bearer.guard";
import { UpdateLikeStatusDto } from "./input-Dtos/update-Like-Status-Model";
import { CurrentUserId } from "../../../decorators/current-user-id.param.decorator";
import { CreateCommentDto } from "./input-Dtos/create-Comment-Dto-Model";
import { BasicAuthGuard } from "../../../guards/basic-auth.guard";
import { JwtForGetGuard } from "../../../guards/jwt-auth-bearer-for-get.guard";


@Controller(`posts`)
export class PostsController {
  constructor(private readonly postsService: PostsService,
              private readonly postsQueryRepositories: PostsQueryRepositories) {
  }


  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`:postId/like-status`)
  async updateLikeStatus(@CurrentUserId() userId: string,
                         @Param(`postId`, IdValidationPipe) id: string,
                         @Body() updateLikeStatusInputModel: UpdateLikeStatusDto) {
    return await this.postsService.updateLikeStatus(id, updateLikeStatusInputModel.likeStatus, userId);
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:postId/comments`)
  async findComments(@CurrentUserId() userId: string,
                     @Param(`postId`, IdValidationPipe) id: string,
                     @Query() paginationInputModel: PaginationDto): Promise<PaginationViewModel<CommentsViewType[]>> {
    return await this.postsQueryRepositories.findCommentsByIdPost(id, paginationInputModel, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`:postId/comments`)
  async createComment(@CurrentUserId() userId: string,
                      @Param(`postId`, IdValidationPipe) id: string,
                      @Body() inputCommentModel: CreateCommentDto) {
    return await this.postsService.createComment(id, inputCommentModel.content, userId);
  }

  @UseGuards(JwtForGetGuard)
  @Get()
  async findAll(@CurrentUserId() userId: string,
                @Query() pagination: PaginationDto): Promise<PaginationViewModel<PostViewModel[]>> {
    return await this.postsQueryRepositories.findPosts(pagination, userId);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() postInputModel: CreatePostDto): Promise<PostViewModel> {
    return this.postsService.createPost(postInputModel);
  }

  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(@CurrentUserId() userId: string,
                @Param(`id`, IdValidationPipe) id: string): Promise<PostViewModel> {
    return await this.postsQueryRepositories.findPost(id, userId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(`:id`)
  async updatePost(@Param(`id`, IdValidationPipe) id: string,
                   @Body() postInputModel: CreatePostDto): Promise<boolean> {
    return await this.postsService.updatePost(id, postInputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(`:id`)
  @HttpCode(204)
  async deletePost(@Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    return await this.postsService.removePost(id);
  }
}
