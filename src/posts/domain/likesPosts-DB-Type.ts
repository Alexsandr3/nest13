import { ObjectId } from 'mongodb';

export class LikesPostsDBType {
  constructor(
    public _id: ObjectId,
    public addedAt: string,
    public userId: string,
    public parentId: string,
    public login: string,
    public likeStatus: string,
  ) {}
}
