import { ObjectId } from 'mongodb';

export interface BanStatusForBlogDBType {
  _id: ObjectId;
  blogId: string;
  ownerId: string;
  userId: string;
  login: string;
  email: string;
  createdAt: string;
  isBanned: string;
  banDate: string;
  banReason: string;
}
