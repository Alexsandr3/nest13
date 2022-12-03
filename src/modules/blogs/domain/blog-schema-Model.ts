import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String, required: true, maxlength: 15, trim: true })
  name: string;
  @Prop({ type: String, required: true, maxlength: 500, trim: true })
  description: string;
  @Prop({ type: String, required: true, maxlength: 100, trim: true })
  websiteUrl: string;
  @Prop({ type: String, required: true })
  createdAt: string;
}
export const BlogSchema = SchemaFactory.createForClass(Blog);
