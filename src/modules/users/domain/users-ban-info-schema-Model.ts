import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type UserBanInfoDocument = HydratedDocument<UserBanInfo>;

@Schema()
export class UserBanInfo {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String })
  banDate: string;
  @Prop({ type: String })
  banReason: string;
}

export const UserBanInfoSchema = SchemaFactory.createForClass(UserBanInfo);

