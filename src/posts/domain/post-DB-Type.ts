import { ObjectId } from 'mongodb';

export interface BlogDBType {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
}
