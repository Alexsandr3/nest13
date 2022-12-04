import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../domain/users-schema-Model";
import { AccountDataType } from "../domain/user-preparation-for-DB";
import { ObjectId } from "mongodb";

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  async createUser(newUser: AccountDataType): Promise<string> {
    const createdUser = new this.userModel(newUser);
    const user = await createdUser.save();
    return user._id.toString();
  }

  async deleteUser(id: string): Promise<boolean> {
   /* if (!ObjectId.isValid(id)) {
      return false;
    }*/
    const result = await this.userModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }


}
