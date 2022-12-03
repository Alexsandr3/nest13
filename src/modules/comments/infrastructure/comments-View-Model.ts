export class CommentsViewType {
  constructor(public id: string,
              public content: string,
              public userId: string,
              public userLogin: string,
              public createdAt: string,
              public likesInfo: LikesInfoViewModel) {
  }
}

export class LikesInfoViewModel {
  constructor(public likesCount: number,
              public dislikesCount: number,
              public myStatus: string) {
  }
}