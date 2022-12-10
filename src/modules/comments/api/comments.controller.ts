import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { CommentsQueryRepositories } from "../infrastructure/query-repository/comments-query.repositories";
import { CommentsViewType } from "../infrastructure/comments-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { UpdateLikeStatusDto } from "../../posts/api/input-Dtos/update-Like-Status-Model";
import { CommentsService } from "../domain/comments.service";
import { CurrentUserId } from "../../auth/decorators/current-user-id.param.decorator";
import { UpdateCommentDto } from "./input-Dtos/update-Comment-Dto-Model";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth-bearer.guard";
import { JwtForGetGuard } from "../../auth/guard/jwt-auth-bearer-for-get.guard";


@Controller(`comments`)
export class CommentsController {
  constructor(protected commentsQueryRepositories: CommentsQueryRepositories,
              protected commentsService: CommentsService) {
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`/:id/like-status`)
  async updateLikeStatus(@CurrentUserId() userId: string,
                         @Param(`id`, IdValidationPipe) id: string,
                         @Body() input: UpdateLikeStatusDto): Promise<boolean> {
    return await this.commentsService.updateLikeStatus(id, input.likeStatus, userId);
  }


  @UseGuards(JwtForGetGuard)
  @Get(`/:id`)
  async findAll(@CurrentUserId() userId: string,
                @Param(`id`, IdValidationPipe) id: string): Promise<CommentsViewType> {
    return this.commentsQueryRepositories.findComments(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`/:id`)
  async updateCommentsById(@CurrentUserId() userId: string,
                           @Param(`id`, IdValidationPipe) id: string,
                           @Body() input: UpdateCommentDto): Promise<boolean> {
    await this.commentsService.updateCommentsById(id, input.content, userId);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(`/:id`)
  async deleteCommentById(@CurrentUserId() userId: string,
                          @Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    await this.commentsService.deleteCommentById(id, userId);
    return true;
  }
}
