import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true, maxlength: 30, trim: true })
  title: string;
  @Prop({ type: String, required: true, maxlength: 100 })
  shortDescription: string;
  @Prop({ type: String, required: true, maxlength: 1000 })
  content: string;
  @Prop({ type: String, required: true })
  blogId: string;
  @Prop({ type: String, required: true })
  blogName: string;
  @Prop({ type: String, required: true })
  createdAt: string;

  constructor(userId: string,
              title: string,
              shortDescription: string,
              content: string,
              blogId: string,
              blogName: string) {
    this.userId = userId;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
  }

  static createPost(userId: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
    if (title.length > 30 && shortDescription.length > 100 && content.length > 1000) {
      throw new Error("Incorrect input data for create User");
    }
    return new Post(userId, title, shortDescription, content, blogId, blogName);
  }

  updatePost(title: string, shortDescription: string, content: string, blogId: string) {
    if (title.length < 30 && shortDescription.length < 100 && content.length < 1000) {
      this.title = title;
      this.shortDescription = shortDescription;
      this.content = content;
      this.blogId = blogId;
    } else {
      throw new Error("Incorrect input data for update post");
    }
  }

  getOwnerPost() {
    return this.userId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);


PostSchema.methods = {
  updatePost: Post.prototype.updatePost,
  getOwnerPost: Post.prototype.getOwnerPost
};