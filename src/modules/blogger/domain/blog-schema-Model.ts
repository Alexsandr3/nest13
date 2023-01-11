import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UpdateBlogDto } from "../api/input-dtos/update-Blog-Dto-Model";

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String })
  userId: string;
  @Prop({ type: String, required: true, minlength: 3, maxlength: 10 })
  userLogin: string;
  @Prop({ type: String, required: true, maxlength: 15, trim: true })
  name: string;
  @Prop({ type: String, required: true, maxlength: 500, trim: true })
  description: string;
  @Prop({
    type: String, required: true, maxlength: 100, trim: true
  })
  websiteUrl: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
  @Prop({ type: String, default: null })
  banDate: string;

  constructor(userId: string,
              login: string,
              name: string,
              description: string,
              websiteUrl: string) {
    this.userId = userId;
    this.userLogin = login;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
  }

  static createBlog(userId: string, login: string, name: string, description: string, websiteUrl: string) {
    const reg = new RegExp(`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$`);
    if (name.length > 15 && description.length > 500 && description.length > 100 && !reg.test(websiteUrl)) {
      throw new Error("Incorrect input data for create User");
    }
    return new Blog(userId, login, name, description, websiteUrl);
  }

  getName() {
    return this.name;
  }

  updateBlog(dto: UpdateBlogDto) {
    const { name, description, websiteUrl } = dto;
    const reg = new RegExp(`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$`);
    if (!reg.test(websiteUrl)) {
      throw new Error(`Incorrect input #web data for update blog`);
    }
    if (name.length < 15 && description.length < 500 && websiteUrl.length < 100) {
      this.name = name;
      this.websiteUrl = websiteUrl;
      this.description = description;
    } else {
      throw new Error(`Incorrect input data for update blog`);
    }
  }

  checkOwner(userId: string) {
    return this.userId === userId; //throw new Error("Not owner Blog");
  }

  checkStatusBan() {
    return this.isBanned;  //throw new Error("User banned");
  }

  updateOwner(userId: string) {
    this.userId = userId;
  }

  updateBanStatus(isBanned: boolean) {
    this.isBanned = isBanned;
    this.banDate = new Date().toISOString();
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
  checkOwner: Blog.prototype.checkOwner,
  checkStatusBan: Blog.prototype.checkStatusBan,
  getName: Blog.prototype.getName,
  updateOwner: Blog.prototype.updateOwner,
  updateBanStatus: Blog.prototype.updateBanStatus
};




