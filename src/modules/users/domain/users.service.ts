import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../api/input-Dto/create-User-Dto-Model";
import { AccountDataType } from "./user-preparation-for-DB";
import * as bcrypt from "bcrypt";
import { UsersRepositories } from "../infrastructure/users-repositories";
import { UsersQueryRepositories } from "../infrastructure/users-query.reposit";
import { UsersViewType } from "../infrastructure/user-View-Model";
import { MailService } from "../../mail/mail.service";
import { randomUUID } from "crypto";
import { NotFoundExceptionMY } from "../../../helpers/My-HttpExceptionFilter";


@Injectable()
export class UsersService {
  constructor(protected usersRepositories: UsersRepositories,
              protected usersQueryRepositories: UsersQueryRepositories,
              protected mailService: MailService) {
  }

  private _generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async createUser(userInputModel: CreateUserDto): Promise<UsersViewType | null> {
    //generation Hash
    const passwordHash = await this._generateHash(userInputModel.password);
    // preparation data User for DB
    const user = new AccountDataType(
      userInputModel.login,
      userInputModel.email,
      passwordHash,
      new Date().toISOString()
    );
    /* {
       confirmationCode: uuidv4(),
       expirationDate: add(new Date(), {
         hours: 1
       }),
       isConfirmation: false,
       sentEmails: [{
         sentDate: new Date()
       }]
     },
     {
       recoveryCode: randomUUID(),
       expirationDate: add(new Date(), {
         hours: 1
       }),
       isConfirmation: false,
       sentEmails: [{
         sentDate: new Date()
       }]
     })*/
    const userId = await this.usersRepositories.createUser(user);
    //finding user for View
    const foundUser = await this.usersQueryRepositories.findUser(userId);
    try {
      //send mail for confirmation
      await this.mailService.sendUserConfirmation(foundUser, randomUUID());
    } catch (error) {
      console.error(error);
      //if not saved user - him need remove ??
      //await this.usersRepositories.deleteUser(userId);
      throw new HttpException("Service is unavailable. Please try again later. We need saved User", 421);
    }
    return foundUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const res = await this.usersRepositories.deleteUser(id);
    if (!res) {
      throw new NotFoundExceptionMY(`Not found for id:${id}`)
    }
    return true;
  }


}
