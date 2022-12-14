import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LeanDocument, Model } from "mongoose";
import { User, UserDocument } from "../../domain/users-schema-Model";
import { ObjectId } from "mongodb";
import { BanInfoType, UsersViewType } from "./user-View-Model";
import { PaginationUsersDto } from "../../api/input-Dto/pagination-Users-Dto-Model";
import { PaginationViewModel } from "../../../blogs/infrastructure/query-repository/pagination-View-Model";
import { NotFoundExceptionMY, UnauthorizedExceptionMY } from "../../../../helpers/My-HttpExceptionFilter";
import { MeViewModel } from "../../../auth/infrastructure/me-View-Model";
import { UserBanInfo, UserBanInfoDocument } from "../../domain/users-ban-info-schema-Model";

@Injectable()
export class UsersQueryRepositories {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
              @InjectModel(UserBanInfo.name) private readonly userBanInfoModel: Model<UserBanInfoDocument>) {
  }

  private async mappedForUser(user: LeanDocument<UserDocument>): Promise<UsersViewType> {
    const banInfoDocument = await this.userBanInfoModel.findOne({ userId: user._id.toString() });
    const banInfo = new BanInfoType(
      banInfoDocument.isBanned,
      banInfoDocument.banDate,
      banInfoDocument.banReason
    )
    return new UsersViewType(
      user._id.toString(),
      user.accountData.login,
      user.accountData.email,
      user.accountData.createdAt,
      banInfo
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
    const items = await Promise.all(mappedUsers)
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
      items
    );
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
