import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LeanDocument, Model } from "mongoose";
import { User, UserDocument } from "../../domain/users-schema-Model";
import { ObjectId } from "mongodb";
import { UsersViewType } from "./user-View-Model";
import { PaginationUsersDto } from "../../api/input-Dto/pagination-Users-Dto-Model";
import { PaginationViewModel } from "../../../blogs/infrastructure/query-repository/pagination-View-Model";
import { NotFoundExceptionMY, UnauthorizedExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";
import { MeViewModel } from "../../../auth/infrastructure/me-View-Model";

@Injectable()
export class UsersQueryRepositories {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  private mappedForUser(user: LeanDocument<UserDocument>): UsersViewType {
    return new UsersViewType(
      user._id.toString(),
      user.accountData.login,
      user.accountData.email,
      user.accountData.createdAt
    );
  }

  async findUser(id: string): Promise<UsersViewType> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!user) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    }
    return this.mappedForUser(user);
  }

  async findUsers(data: PaginationUsersDto): Promise<PaginationViewModel<UsersViewType[]>> {
    const foundsUsers = await this.userModel
      .find({
        $or: [
          { "accountData.email": { $regex: data.searchEmailTerm, $options: "i" } },
          { "accountData.login": { $regex: data.searchLoginTerm, $options: "i" } }
        ]
      })
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [`accountData.${data.sortBy}`]: data.sortDirection })
      .lean();
    //mapped user for View
    const mappedUsers = foundsUsers.map(user => this.mappedForUser(user));
    //counting users
    const totalCount = await this.userModel.countDocuments({
      $or: [
        { "accountData.email": { $regex: data.searchEmailTerm, $options: "i" } },
        { "accountData.login": { $regex: data.searchLoginTerm, $options: "i" } }
      ]
    });
    const pagesCountRes = Math.ceil(totalCount / data.pageSize);
    // Found Users with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCount,
      mappedUsers);
  }

  async getUserById(id: string): Promise<MeViewModel> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new UnauthorizedExceptionMY(`incorrect userId`);
    } else {
      return new MeViewModel(
        user.accountData.email,
        user.accountData.login,
        user._id.toString()
      );
    }
  }
}
