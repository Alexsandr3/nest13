import { ObjectId } from 'mongodb';

export interface BlogsDBType {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
