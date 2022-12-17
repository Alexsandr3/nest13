import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class AccountData {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 10 })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: String, required: true })
  createdAt: string;
}

//const AccountDataSchema = SchemaFactory.createForClass(AccountData);
@Schema()
class EmailConfirmation {
  @Prop({ type: String, required: true })
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ type: Boolean, default: false })
  isConfirmation: boolean;
}

//const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
@Schema()
class EmailRecovery {
  @Prop({ type: String, required: true })
  recoveryCode: string;
  @Prop()
  expirationDate: Date;
  @Prop({ type: Boolean, default: false })
  isConfirmation: boolean;
}
//const EmailRecoverySchema = SchemaFactory.createForClass(EmailRecovery);

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  accountData: AccountData;
  @Prop()
  emailConfirmation: EmailConfirmation;
  @Prop()
  emailRecovery: EmailRecovery;
}

export const UserSchema = SchemaFactory.createForClass(User);
