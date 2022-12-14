import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { SaController } from "./api/sa.controller";
import { SaService } from "./domain/sa.service";
import { BasicAuthGuard } from "../../guards/basic-auth.guard";
import { BlogsQueryRepositories } from "../blogs/infrastructure/query-repository/blogs-query.repositories";
import { Blog, BlogSchema } from "../blogger/domain/blog-schema-Model";
import { BindBlogHandler } from "./application/use-cases/handlers/bind-blog-handler";
import { BlogsRepositories } from "../blogs/infrastructure/blogs.repositories";

const handlers = [BindBlogHandler];
const adapters = [BlogsQueryRepositories, BlogsRepositories];
const guards = [BasicAuthGuard];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema }
      // { name: Post.name, schema: PostSchema },
      //{ name: Comment.name, schema: CommentSchema },
      //{ name: LikesStatus.name, schema: likesStatusSchema },
      // { name: LikesPostsStatus.name, schema: likesPostsStatusSchema }
    ]),
    CqrsModule
  ],
  controllers: [SaController],
  providers: [SaService, ...guards, ...handlers, ...adapters]
})
export class SaModule {
}
