import { Injectable } from "@nestjs/common";

@Injectable()
export class CommentsService {
  constructor() {
  }

}


/*  public async findComment(id: string, userId: string): Promise<boolean> {
    //finding comment by id from uri params
    const comment = await this.commentsRepositories.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`Not found content`);
    if (comment.userId !== userId)
      throw new ForbiddenExceptionMY(`You are not the owner of the comment`);
    return true;
  }*/