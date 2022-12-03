import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "../blogs/domain/blog-schema-Model";
import { Post, PostSchema } from "../posts/domain/post-schema-Model";
import { User, UserSchema } from "../users/domain/users-schema-Model";
import { TestingController } from "./testins.controller";
import { Comment, CommentSchema } from "../comments/domain/comments-schema-Model";
import { TestingService } from "./testing.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema }
    ]),
  ],

  controllers: [TestingController],
  providers: [TestingService]
})
export class TestingModule {
}
