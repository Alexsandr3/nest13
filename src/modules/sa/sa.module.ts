import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { SaController } from './api/sa.controller';
import { SaService } from './domain/sa.service';
import { BasicAuthGuard } from '../../guards/basic-auth.guard';
import { BlogsQueryRepositories } from '../blogs/infrastructure/query-repository/blogs-query.repositories';
import { Blog, BlogSchema } from '../blogger/domain/blog-schema-Model';
import { BindBlogHandler } from './application/use-cases/handlers/bind-blog-handler';
import { BlogsRepositories } from '../blogs/infrastructure/blogs.repositories';
import { BlogBanInfo, BlogBanInfoSchema } from "../blogger/domain/ban-user-for-current-blog-schema-Model";
import { UpdateBanInfoForBlogHandler } from "./application/use-cases/handlers/update-ban-info-for-blog-handler";

const handlers = [BindBlogHandler, UpdateBanInfoForBlogHandler];
const adapters = [BlogsQueryRepositories, BlogsRepositories];
const guards = [BasicAuthGuard];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: BlogBanInfo.name, schema: BlogBanInfoSchema }
      // { name: Post.name, schema: PostSchema },
      //{ name: Comment.name, schema: CommentSchema },
      //{ name: LikesStatus.name, schema: likesStatusSchema },
      // { name: LikesPostsStatus.name, schema: likesPostsStatusSchema }
    ]),
    CqrsModule,
  ],
  controllers: [SaController],
  providers: [SaService, ...guards, ...handlers, ...adapters],
})
export class SaModule {}
