import { Controller, Get, Param } from "@nestjs/common";
import { CommentsQueryRepositories } from "../infrastructure/comments-query.repositories";
import { CommentsViewType } from "../infrastructure/comments-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";


@Controller(`comments`)
export class CommentsController {
  constructor(protected commentsQueryRepositories: CommentsQueryRepositories) {
  }

  @Get(`/:id`)
  async findAll(@Param(`id`, IdValidationPipe) id: string): Promise<CommentsViewType> {
    return this.commentsQueryRepositories.findComments(id);
  }

}
