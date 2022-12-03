import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../api/input-Dto/create-User-Dto-Model";
import { AccountDataType } from "./user-preparation-for-DB";
import * as bcrypt from 'bcrypt'
import { UsersRepositories } from "../infrastructure/users-repositories";
import { UsersQueryRepositories } from "../infrastructure/users-query.reposit";
import { UsersViewType } from "../infrastructure/user-View-Model";
import { MailService } from "../../mail/mail.service";
import { randomUUID } from "crypto";


@Injectable()
export class UsersService {
  constructor(protected usersRepositories: UsersRepositories,
              protected usersQueryRepositories: UsersQueryRepositories,
              protected mailService: MailService) {
  }
  private _generateHash(password: string) {
    return bcrypt.hash(password, 10)
  }

  async createUser(userInputModel: CreateUserDto): Promise<UsersViewType | null> {
    const passwordHash = await this._generateHash(userInputModel.password)
    const user = new AccountDataType(
      userInputModel.login,
      userInputModel.email,
      passwordHash,
      new Date().toISOString()
    )
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
    const userId = await this.usersRepositories.createUser(user)
    const foundUser = await this.usersQueryRepositories.findUser(userId)
    if (!foundUser) return null
    try {
      await this.mailService.sendUserConfirmation(foundUser, randomUUID())
    } catch (error) {
      console.error(error)
      //await this.usersRepositories.deleteUser(user._id)
      return null
    }
    return foundUser
  }
  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepositories.deleteUser(id)
  }


}
