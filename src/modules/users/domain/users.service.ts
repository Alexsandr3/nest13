import {  HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../api/input-Dto/create-User-Dto-Model";
import { PreparationUserForDB } from "./user-preparation-for-DB";
import * as bcrypt from "bcrypt";
import { UsersRepositories } from "../infrastructure/users-repositories";
import { UsersQueryRepositories } from "../infrastructure/query-reposirory/users-query.reposit";
import { UsersViewType } from "../infrastructure/query-reposirory/user-View-Model";
import { MailService } from "../../mail/mail.service";
import { randomUUID } from "crypto";
import {
  BadRequestExceptionMY,
  NotFoundExceptionMY,
  UnauthorizedExceptionMY
} from "../../../helpers/My-HttpExceptionFilter";
import { add } from "date-fns";
import { UsersDBType } from "./user-DB-Type";
import { JwtService, TokensType } from "../../auth/application/jwt.service";
import { DeviceRepositories } from "../../security/infrastructure/device-repositories";
import { PayloadType } from "../../auth/application/payloadType";


@Injectable()
export class UsersService {
  constructor(protected usersRepositories: UsersRepositories,
              protected usersQueryRepositories: UsersQueryRepositories,
              protected jwtService: JwtService,
              protected deviceRepositories: DeviceRepositories,
              protected mailService: MailService) {
  }

  private generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  private checkCodeConfirm(user: UsersDBType, code: string) {
    if (user.emailConfirmation.isConfirmation) throw new BadRequestExceptionMY([`Code has confirmation already`]);
    if (user.emailConfirmation.confirmationCode !== code) throw new BadRequestExceptionMY([`Company is not confirmed`]);
    if (user.emailConfirmation.expirationDate < new Date()) throw new BadRequestExceptionMY([`Confirmation has expired`]);
    return user;
  }

  private checkUser(isConfirmation: Boolean, expirationDate: Date) {
    if (isConfirmation) throw new BadRequestExceptionMY([`Code has confirmation already`]);
    if (expirationDate < new Date()) throw new BadRequestExceptionMY([`Confirmation has expired`]);
    return;
  }

  private async validateUser(userInputModel: CreateUserDto): Promise<CreateUserDto> {
    //find user
    const checkEmail = await this.usersQueryRepositories.findByLoginOrEmail(userInputModel.email);
    if (checkEmail) throw new BadRequestExceptionMY([`${userInputModel.email}  already in use, do you need choose new data`]);
    const checkLogin = await this.usersQueryRepositories.findByLoginOrEmail(userInputModel.login);
    if (checkLogin) throw new BadRequestExceptionMY([`${userInputModel.login}  already in use, do you need choose new data`]);
    return userInputModel;
  }

  async createUser(userInputModel: CreateUserDto): Promise<UsersViewType> {
    //checking email and login in for uniqueness
    await this.validateUser(userInputModel);
    //generation Hash
    const passwordHash = await this.generateHash(userInputModel.password);
    // preparation data User for DB
    const login = userInputModel.login;
    const email = userInputModel.email;
    const user = new PreparationUserForDB(
      {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString()
      },
      {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmation: false
      },
      {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmation: false
      }
    );
    const userId = await this.usersRepositories.createUser(user);
    //finding user for View
    const foundUser = await this.usersQueryRepositories.findUser(userId);
    try {
      //send mail for confirmation
      await this.mailService.sendUserConfirmation(foundUser.email, user.emailConfirmation.confirmationCode);
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
      throw new NotFoundExceptionMY(`Not found for id:${id}`);
    }
    return true;
  }

  async confirmByCode(code: string): Promise<boolean> {
    //find user by code
    const user = await this.usersRepositories.findUserByConfirmationCode(code);
    if (!user) throw new BadRequestExceptionMY([`Invalid code or you are already registered`]);
    //check code
    await this.checkCodeConfirm(user, code);
    return await this.usersRepositories.updateConfirmation(user._id);
  }

  async recovery(email: string): Promise<boolean> {
    const user = await this.usersRepositories.findByLoginOrEmail(email);
    if (!user) throw new BadRequestExceptionMY(`${email} has invalid`);
    await this.checkUser(user.emailConfirmation.isConfirmation, user.emailConfirmation.expirationDate);
    const code: any = {
      emailRecovery: {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 })
      }
    };
    await this.usersRepositories.updateCodeRecovery(user._id, code.emailRecovery.recoveryCode, code.emailRecovery.expirationDate);
    try {
      await this.mailService.sendPasswordRecoveryMessage(user.accountData.email, code.emailRecovery.recoveryCode);
    } catch (error) {
      console.error(error);
      throw new HttpException("Service is unavailable. Please try again later. We need saved User", 421);
    }
    return true;
  }

  async newPassword(newPassword: string, code: string): Promise<boolean> {
    //search user by code
    const user = await this.usersRepositories.findUserByRecoveryCode(code);
    if (!user) throw new BadRequestExceptionMY([`Incorrect input data`]);
    //check code confirmation
    await this.checkCodeConfirm(user, code);
    //generation new passwordHash for save
    const passwordHash = await this.generateHash(newPassword);
    return await this.usersRepositories.updateRecovery(user._id, passwordHash);
  }

  async resending(email: string): Promise<boolean> {
    //search user by email
    const user = await this.usersRepositories.findByLoginOrEmail(email);
    if (!user) throw new BadRequestExceptionMY([`Incorrect input data`]);
    //check code
    await this.checkUser(user.emailConfirmation.isConfirmation, user.emailConfirmation.expirationDate);
    //generation new code
    const code: any = {
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 })
      }
    };
    //update code confirmation
    await this.usersRepositories.updateCodeConfirmation(user._id, code.emailConfirmation.confirmationCode, code.emailConfirmation.expirationDate);
    try {
      //sending code to email
      await this.mailService.sendEmailRecoveryMessage(user.accountData.email, code.emailConfirmation.confirmationCode);
    } catch (error) {
      console.error(error);
      throw new HttpException("Service is unavailable. Please try again later. We need saved User", 421);
    }
    return true;
  }

  async refresh(payload: PayloadType): Promise<TokensType> {
    //generation new tokens
    const newTokens = await this.jwtService.createJwt(payload.userId, payload.deviceId);
    const payloadNew: PayloadType = await this.jwtService.verifyToken(newTokens.refreshToken);
    //preparation data for update device
    const userId = payloadNew.userId;
    const deviceId = payloadNew.deviceId;
    const dateCreatedOldToken = (new Date(payload.iat * 1000)).toISOString();
    const dateCreateToken = (new Date(payloadNew.iat * 1000)).toISOString();
    const dateExpiredToken = (new Date(payloadNew.exp * 1000)).toISOString();
    await this.deviceRepositories.updateDateDevice(
      userId, deviceId, dateCreateToken, dateExpiredToken, dateCreatedOldToken);
    return newTokens;
  }

  async logout(payload: PayloadType): Promise<boolean> {
    const { userId, deviceId } = payload;
    const dateCreatedToken = (new Date(payload.iat * 1000)).toISOString();
    //search device
    const device = await this.deviceRepositories.findDeviceForDelete(userId, deviceId, dateCreatedToken);
    if (!device) throw new UnauthorizedExceptionMY("not today sorry man");
    //remove device
    const isDeleted = await this.deviceRepositories.deleteDevice(userId, deviceId);
    if (!isDeleted) throw new UnauthorizedExceptionMY("not today");
    return true;
  }
}
