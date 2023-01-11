import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusType } from '../../posts/domain/likePost-schema-Model';

export type LikeCommentDocument = HydratedDocument<LikeComment>;

@Schema()
export class LikeComment {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  parentId: string;
  @Prop({ type: String, default: 'None', enum: LikeStatusType })
  likeStatus: string;

  constructor(userId: string,
              parentId: string) {
    this.userId = userId
    this.parentId = parentId
  }

  static createLikeComment(userId: string, parentId: string) {
    return new LikeComment(userId, parentId);
  }

  updateLikeComment(likeStatus: string) {
    this.likeStatus = likeStatus;
  }
}
export const LikeCommentSchema = SchemaFactory.createForClass(LikeComment);


LikeCommentSchema.methods = {
  updateLikeComment: LikeComment.prototype.updateLikeComment,
}