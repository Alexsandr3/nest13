import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../domain/users-schema-Model";
import { ObjectId } from "mongodb";
import { UsersDBType } from "../domain/user-DB-Type";
import { UsersViewType } from "./user-View-Model";

@Injectable()
export class UsersQueryRepositories {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  private _mappedForUser(user: UsersDBType): UsersViewType {
    return new UsersViewType(
      user._id?.toString(),
      user.login,
      user.email,
      user.createdAt
    );
  }

  async findUser(id: string): Promise<UsersViewType | null> {
    const result = await this.userModel.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    } else {
      return this._mappedForUser(result);
    }
  }

}
