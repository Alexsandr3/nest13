import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BlogBanInfoDocument = HydratedDocument<BlogBanInfo>;

@Schema()
export class BlogBanInfo {
  @Prop({ type: String, required: true })
  blogId: string;
  @Prop({ type: String, required: true })
  ownerId: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, default: null })
  banDate: string;
  @Prop({ type: String, default: null })
  banReason: string;

  constructor(blogId: string,
              ownerId: string,
              userId: string,
              login: string,
              email: string) {
    this.blogId = blogId;
    this.ownerId = ownerId;
    this.userId = userId;
    this.login = login;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  static createBan(blogId: string, ownerId: string, userId: string, login: string, email: string) {
    return new BlogBanInfo(blogId, ownerId, userId, login, email);
  }

  checkStatusBan() {
    return this.isBanned;
  }

  unlockBanStatus() {
    this.isBanned = false;
    this.banReason = null;
    this.banDate = null;
  }


  banBanStatus(banReason: string) {
    this.isBanned = true;
    this.banReason = banReason;
    this.banDate = new Date().toISOString();
  }
}

export const BlogBanInfoSchema = SchemaFactory.createForClass(BlogBanInfo);

BlogBanInfoSchema.methods = {
  checkStatusBan: BlogBanInfo.prototype.checkStatusBan,
  unlockBanStatus: BlogBanInfo.prototype.unlockBanStatus,
  banBanStatus: BlogBanInfo.prototype.banBanStatus
};