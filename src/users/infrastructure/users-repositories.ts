import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../domain/users-schema-Model";
import { AccountDataType } from "../domain/user-preparation-for-DB";

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }
  async createUser(newUser: AccountDataType): Promise<string> {
    const createdUser = new this.userModel(newUser)
    const user = await createdUser.save()
    return user._id.toString()
  }


}
