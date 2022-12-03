import { Controller, Get, Param } from "@nestjs/common";
import { CommentsQueryRepositories } from "../infrastructure/comments-query.repositories";
import { CommentsViewType } from "../infrastructure/comments-View-Model";


@Controller(`comments`)
export class CommentsController {
  constructor(protected commentsQueryRepositories: CommentsQueryRepositories) {
  }

  @Get(`/:id`)
  async findAll(@Param("id") id: string): Promise<CommentsViewType | null> {
    return this.commentsQueryRepositories.findComments(id);
  }

}
