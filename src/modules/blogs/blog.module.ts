import { Module } from "@nestjs/common";
import { BlogsService } from "./domain/blogs.service";
import { BlogsRepositories } from "./infrastructure/blogs.repositories";
import { BlogsController } from "./api/blogs.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./domain/blog-schema-Model";
import { BlogsQueryRepositories } from "./infrastructure/query-repository/blogs-query.repositories";
import { PostsRepositories } from "../posts/infrastructure/posts-repositories";
import { Post, PostSchema } from "../posts/domain/post-schema-Model";
import { PostsQueryRepositories } from "../posts/infrastructure/query-repositories/posts-query.reposit";
import { Comment, CommentSchema } from "../comments/domain/comments-schema-Model";
import { LikesPostsStatus, likesPostsStatusSchema } from "../posts/domain/likesPost-schema-Model";
import { LikesStatus, likesStatusSchema } from "../comments/domain/likesStatus-schema-Model";
import { BasicStrategy } from "../../strategies/basic.strategy";
import { JwtForGetGuard } from "../../guards/jwt-auth-bearer-for-get.guard";
import { JwtService } from "../auth/application/jwt.service";
import { CreateBlogHandler } from "./application/use-cases/handlers/create-blog-handler";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteBlogHandler } from "./application/use-cases/handlers/delete-blog-handler";
import { UpdateBlogHandler } from "./application/use-cases/handlers/update-blog-handler";
import { CreatePostHandler } from "./application/use-cases/handlers/create-post-handler";

const handlers = [CreateBlogHandler, DeleteBlogHandler, UpdateBlogHandler, CreatePostHandler];
const adapters = [BlogsRepositories, BlogsQueryRepositories, PostsRepositories, PostsQueryRepositories, JwtService];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: LikesStatus.name, schema: likesStatusSchema },
      { name: LikesPostsStatus.name, schema: likesPostsStatusSchema }
    ]),
    CqrsModule
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BasicStrategy, JwtForGetGuard, ...handlers, ...adapters]
})
export class BlogModule {
}
