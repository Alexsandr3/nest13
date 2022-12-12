import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { BadRequestExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { UsersDBType } from "./user-DB-Type";


@Injectable()
export class UsersService {
  constructor() {
  }

  public generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }

  public checkCodeConfirm(user: UsersDBType, code: string) {
    if (user.emailConfirmation.isConfirmation) throw new BadRequestExceptionMY({
      message: `Code has confirmation already`,
      field: "code"
    });
    if (user.emailConfirmation.confirmationCode !== code) throw new BadRequestExceptionMY({
      message: `Company is not confirmed`,
      field: "code"
    });
    if (user.emailConfirmation.expirationDate < new Date()) throw new BadRequestExceptionMY({
      message: `Confirmation has expired`,
      field: "code"
    });
    return;
  }

  public checkUser(isConfirmation: Boolean, expirationDate: Date) {
    if (isConfirmation) throw new BadRequestExceptionMY({ message: `Code has confirmation already`, field: "email" });
    if (expirationDate < new Date()) throw new BadRequestExceptionMY({
      message: `Confirmation has expired`, field: "email"
    });
    return;
  }

  /*private async validateUser(userInputModel: CreateUserDto): Promise<boolean> {
    //find user
    const checkEmail = await this.usersRepositories.findByLoginOrEmail(userInputModel.email);
    if (checkEmail) throw new BadRequestExceptionMY({
      message: `${userInputModel.email}  already in use, do you need choose new data`,
      field: `email`
    });
    const checkLogin = await this.usersRepositories.findByLoginOrEmail(userInputModel.login);
    if (checkLogin) throw new BadRequestExceptionMY({
      message: `${userInputModel.login}  already in use, do you need choose new data`,
      field: `login`
    });
    return true;
  }*/

  /*async createUser(userInputModel: CreateUserDto): Promise<UsersViewType> {
    //email verification and login for uniqueness
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
  }*/

  /*async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersRepositories.deleteUser(id);
    if (!result) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    }
    return true;
  }*/

  /*async confirmByCode(code: string): Promise<boolean> {
    //find user by code
    const user = await this.usersRepositories.findUserByConfirmationCode(code);
    if (!user) throw new BadRequestExceptionMY({
      message: `Invalid code, user already registered`,
      field: "code"
    });
    //checking confirmation code
    await this.checkCodeConfirm(user, code);
    //update status code-> true
    return await this.usersRepositories.updateConfirmation(user._id);
  }*/

  /*async recovery(email: string): Promise<boolean> {
    //search user by login or email
    const user = await this.usersRepositories.findByLoginOrEmail(email);
    if (!user) throw new BadRequestExceptionMY({ message: `${email} has invalid`, field: "email" });
    //check code confirmation
    await this.checkUser(user.emailConfirmation.isConfirmation, user.emailConfirmation.expirationDate);
    //generate new code
    const code: any = {
      emailRecovery: {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 })
      }
    };
    //updating new code in DB
    await this.usersRepositories.updateCodeRecovery(user._id, code.emailRecovery.recoveryCode, code.emailRecovery.expirationDate);
    try {
      await this.mailService.sendPasswordRecoveryMessage(user.accountData.email, code.emailRecovery.recoveryCode);
    } catch (error) {
      console.error(error);
      throw new HttpException("Service is unavailable. Please try again later. We need saved User", 421);
    }
    return true;
  }*/

  /*async newPassword(newPassword: string, code: string): Promise<boolean> {
    //search user by code
    const user = await this.usersRepositories.findUserByRecoveryCode(code);
    if (!user) throw new BadRequestExceptionMY({ message: `Incorrect input data`, field: "code" });
    //check code confirmation
    await this.checkCodeConfirm(user, code);
    //generation new passwordHash for save
    const passwordHash = await this.generateHash(newPassword);
    return await this.usersRepositories.updateRecovery(user._id, passwordHash);
  }*/

  /*async resending(email: string): Promise<boolean> {
    //search user by email
    const user = await this.usersRepositories.findByLoginOrEmail(email);
    if (!user) throw new BadRequestExceptionMY({ message: `Incorrect input data`, field: "email" });
    //check code
    await this.checkUser(user.emailConfirmation.isConfirmation, user.emailConfirmation.expirationDate);
    //generation a new code
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
  }*/

  /* async refresh(payload: PayloadType): Promise<TokensType> {
     //generation of a new pair of tokens
     const newTokens: TokensType = await this.jwtService.createJwt(payload.userId, payload.deviceId);
     const payloadNew: PayloadType = await this.jwtService.verifyRefreshToken(newTokens.refreshToken);
     //preparation data for update device in DB
     const userId = payloadNew.userId;
     const deviceId = payloadNew.deviceId;
     const dateCreatedOldToken = (new Date(payload.iat * 1000)).toISOString();
     const dateCreateToken = (new Date(payloadNew.iat * 1000)).toISOString();
     const dateExpiredToken = (new Date(payloadNew.exp * 1000)).toISOString();
     await this.deviceRepositories.updateDateDevice(
       userId, deviceId, dateCreateToken, dateExpiredToken, dateCreatedOldToken);
     return newTokens;
   }*/

  /* async logout(payload: PayloadType): Promise<boolean> {
     const { userId, deviceId } = payload;
     const dateCreatedToken = (new Date(payload.iat * 1000)).toISOString();
     //search device
     const foundDevice = await this.deviceRepositories.findDeviceForDelete(userId, deviceId, dateCreatedToken);
     if (!foundDevice) throw new UnauthorizedExceptionMY("not today sorry man");
     //removing device
     const isDeleted = await this.deviceRepositories.deleteDevice(userId, deviceId);
     if (!isDeleted) throw new UnauthorizedExceptionMY("not today");
     return true;
   }*/
}


