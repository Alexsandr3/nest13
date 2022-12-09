

export class PreparationCommentForDB {
  constructor(
              public postId: string,
              public content: string,
              public userId: string,
              public userLogin: string,
              public createdAt: string) {
  }
}