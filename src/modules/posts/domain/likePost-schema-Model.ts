import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum LikeStatusType {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikePostDocument = HydratedDocument<LikePost>;

@Schema()
export class LikePost {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, required: true })
  addedAt: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  parentId: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, default: "None", enum: LikeStatusType })
  likeStatus: string;

  constructor(userId: string,
              parentId: string,
              login: string) {
    this.addedAt = new Date().toISOString();
    this.userId = userId;
    this.parentId = parentId;
    this.login = login;
  }

  static createLikePost(userId: string, parentId: string, login: string) {
    return new LikePost(userId, parentId, login);
  }

  updateLikePost(likeStatus: string) {
    this.likeStatus = likeStatus;
    this.addedAt = new Date().toISOString();
  }


}

export const LikePostSchema =
  SchemaFactory.createForClass(LikePost);

LikePostSchema.methods = {
  updateLikePost: LikePost.prototype.updateLikePost
};
