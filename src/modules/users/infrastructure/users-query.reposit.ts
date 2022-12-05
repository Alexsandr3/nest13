import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../domain/users-schema-Model";
import { ObjectId } from "mongodb";
import { UsersDBType } from "../domain/user-DB-Type";
import { UsersViewType } from "./user-View-Model";
import { PaginationUsersDto } from "../api/input-Dto/pagination-Users-Dto-Model";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";

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

  async findUsers(data: PaginationUsersDto): Promise<PaginationViewModel<UsersViewType[]>> {
    /*const foundsUsers = await this.userModel
      .find({$or: [
          {"accountData.email": {$regex: data.searchEmailTerm, $options: 'i'}},
          {"accountData.login": {$regex: data.searchLoginTerm, $options: 'i'}}
        ]
      })
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({[data.sortBy]: data.sortDirection})
      .lean()
      const mappedUsers = foundsUsers.map(user => this._mappedForUser(user))
    const totalCount = await this.userModel.countDocuments({
      $or: [
        {"accountData.email": {$regex: data.searchEmailTerm, $options: 'i'}},
        {"accountData.login": {$regex: data.searchLoginTerm, $options: 'i'}}
      ]
    })*/
    const foundsUsers = await this.userModel
      .find({$or: [
          {email: {$regex: data.searchEmailTerm, $options: 'i'}},
          {login: {$regex: data.searchLoginTerm, $options: 'i'}}
        ]
      })
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({[data.sortBy]: data.sortDirection})
      .lean()
      const mappedUsers = foundsUsers.map(user => this._mappedForUser(user))
    const totalCount = await this.userModel.countDocuments({
      $or: [
        {email: {$regex: data.searchEmailTerm, $options: 'i'}},
        {login: {$regex: data.searchLoginTerm, $options: 'i'}}
      ]
    })
    const pagesCountRes = Math.ceil(totalCount / data.pageSize)
    return {
      pagesCount: pagesCountRes,
      page: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: totalCount,
      items: mappedUsers
    }
  }

}
