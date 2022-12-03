import { ObjectId } from "mongodb";

export interface UsersDBType  {
  _id: ObjectId
  login: string
  email: string
  passwordHash: string,
  createdAt: string
}