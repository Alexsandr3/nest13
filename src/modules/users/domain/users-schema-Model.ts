import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import * as bcrypt from "bcrypt";


@Schema({ _id: false })
class AccountData {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 10 })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: String, required: true })
  createdAt: string;

  constructor(login: string,
              email: string,
              passwordHash: string) {
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date().toISOString();
  }
}

@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ type: String, required: true })
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ type: Boolean, default: false })
  isConfirmation: boolean;

  constructor(isConfirmation: boolean) {
    this.confirmationCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
    this.isConfirmation = isConfirmation;
  }
}

@Schema({ _id: false })
class EmailRecovery {
  @Prop({ type: String, required: true })
  recoveryCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ type: Boolean, default: false })
  isConfirmation: boolean;

  constructor() {
    this.recoveryCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
    this.isConfirmation = false;
  }
}

@Schema({ _id: false })
export class UserBanInfo {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String })
  banDate: string;
  @Prop({ type: String })
  banReason: string;

  constructor() {
    this.isBanned = false;
    this.banDate = null;
    this.banReason = null;
  }
}


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  accountData: AccountData;
  @Prop()
  emailConfirmation: EmailConfirmation;
  @Prop()
  emailRecovery: EmailRecovery;
  @Prop()
  banInfo: UserBanInfo;

  constructor(login: string,
              email: string,
              passwordHash: string,
              isConfirmation: boolean) {
    this.accountData = new AccountData(login, email, passwordHash);
    this.emailConfirmation = new EmailConfirmation(isConfirmation);
    this.emailRecovery = new EmailRecovery();
    this.banInfo = new UserBanInfo();
  }

  static createUser(login: string, email: string, passwordHash: string, isConfirmation: boolean): User {
    const reg = new RegExp(`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`);
    if (login.length < 3 && login.length > 10 && !reg.test(email)) {
      throw new Error("Incorrect input data for create User");
    }
    return new User(login, email, passwordHash, isConfirmation);
  }

  getLogin() {
    return this.accountData.login;
  }
  getEmail() {
    return this.accountData.email;
  }

  checkingConfirmCode(code: string) {
    if (this.emailConfirmation.isConfirmation)
      return false // throw new Error("Code has confirmation already");
    if (this.emailConfirmation.confirmationCode !== code)
      return false // throw new Error("Code confirmation not equal code ");
    if (this.emailConfirmation.expirationDate < new Date())
      return false // throw new Error("Confirmation has expired");
    return true;
  }

  checkingEmail() {
    if (this.emailConfirmation.isConfirmation) return false //throw new Error("Code has confirmation already");
    if (this.emailConfirmation.expirationDate < new Date()) return false //throw new Error("Confirmation has expired");
    return true;
  }

  updateStatusConfirmCode() {
    this.emailConfirmation.isConfirmation = true;
  }

  updateConfirmCode() {
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.expirationDate = add(new Date(), { hours: 1 });
  }

  updateRecoveryCode() {
    this.emailRecovery.recoveryCode = randomUUID();
    this.emailRecovery.expirationDate = add(new Date(), { hours: 1 });
  }

  updatePassword(passwordHash: string) {
    this.accountData.passwordHash = passwordHash;
    this.emailRecovery.isConfirmation = true;
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.accountData.passwordHash);
  }

  checkStatusBan() {
    return this.banInfo.isBanned; // throw new Error("User banned");
  }
  banUser(banReason: string){
    this.banInfo.isBanned = true
    this.banInfo.banDate = new Date().toISOString()
    this.banInfo.banReason = banReason
  }
  unblockUser(){
    this.banInfo.isBanned = false
    this.banInfo.banDate = null
    this.banInfo.banReason = null
  }


}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  checkingConfirmCode: User.prototype.checkingConfirmCode,
  updateStatusConfirmCode: User.prototype.updateStatusConfirmCode,
  updateConfirmCode: User.prototype.updateConfirmCode,
  updateRecoveryCode: User.prototype.updateRecoveryCode,
  checkingEmail: User.prototype.checkingEmail,
  updatePassword: User.prototype.updatePassword,
  comparePassword: User.prototype.comparePassword,
  checkStatusBan: User.prototype.checkStatusBan,
  getLogin: User.prototype.getLogin,
  getEmail: User.prototype.getEmail,
  banUser: User.prototype.banUser,
  unblockUser: User.prototype.unblockUser,
};


