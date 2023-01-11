import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, required: true })
  postId: string;
  @Prop({ type: String, required: true })
  ownerId: string;
  @Prop({ type: String, required: true, minlength: 20, maxlength: 300 })
  content: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  userLogin: string;
  @Prop({ type: String, required: true })
  createdAt: string;

  constructor(postId: string,
              ownerId: string,
              content: string,
              userId: string,
              login: string) {
    this.postId = postId;
    this.ownerId = ownerId;
    this.content = content;
    this.userId = userId;
    this.userLogin = login;
    this.createdAt = new Date().toISOString();
  }

  static createComment(postId: string, ownerId: string, content: string, userId: string, login: string) {
    if (content.length > 300 && content.length < 20) {
      return new Comment(postId, ownerId, content, userId, login);
    }
    throw new Error("Incorrect input data for create comment");
  }

  checkOwner(userId: string) {
    return this.userId === userId; //throw new Error("Not owner Comment");
  }

  updateComment(content: string) {
    this.content = content;
  }

}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods = {
  checkOwner: Comment.prototype.checkOwner,
  updateComment: Comment.prototype.updateComment
};