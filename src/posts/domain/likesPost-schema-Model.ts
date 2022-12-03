import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum LikeStatusType {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type LikeStatusDocument = HydratedDocument<LikeStatus>;

@Schema()
export class LikeStatus {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  parentId: string;
  @Prop({ type: String, default: 'None', enum: LikeStatusType })
  likeStatus: string;
}
export const LikeStatusSchema = SchemaFactory.createForClass(LikeStatus);
