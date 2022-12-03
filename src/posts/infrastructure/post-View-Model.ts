import { ObjectId } from 'mongodb';
import { LikeDetailsViewModel } from './likesInfoViewModel';

export class mapperForPostViewModel {
  id;
  title;
  shortDescription;
  content;
  blogId;
  blogName;
  createdAt;
  constructor(model: PostDBType) {
    this.id = model._id.toString();
    this.title = model.title;
    this.shortDescription = model.shortDescription;
    this.content = model.content;
    this.blogId = model.blogId;
    this.blogName = model.blogName;
    this.createdAt = model.createdAt;
  }
}

export interface PostDBType {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export class PostViewModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
  ) {}
}

export class ExtendedLikesInfoViewModel {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
    public newestLikes: Array<LikeDetailsViewModel>,
  ) {}
}
