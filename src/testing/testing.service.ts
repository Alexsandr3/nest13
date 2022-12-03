import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "../blogs/domain/blog-schema-Model";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../comments/domain/comments-schema-Model";
import { Post, PostDocument } from "../posts/domain/post-schema-Model";
import { User, UserDocument } from "../users/domain/users-schema-Model";

@Injectable()
export class TestingService {
  constructor(@InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
              @InjectModel(Comment.name) private readonly commentsModel: Model<CommentDocument>,
              @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
              @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }
  async deleteAll(){
    await this.blogsModel.deleteMany();
    await this.postModel.deleteMany();
    await this.userModel.deleteMany();
    await this.commentsModel.deleteMany();
    return
  }


}
