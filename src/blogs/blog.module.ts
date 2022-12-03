import { Module } from '@nestjs/common';
import { BlogsService } from './domain/blogs.service';
import { BlogsRepositories } from './infrastructure/blogs.repositories';
import { BlogsController } from './api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog-schema-Model';
import { BlogsQueryRepositories } from './infrastructure/blogs-query.repositories';
import { PostsRepositories } from '../posts/infrastructure/posts-repositories';
import { Post, PostSchema } from "../posts/domain/post-schema-Model";
import { PostsQueryRepositories } from "../posts/infrastructure/posts-query.reposit";
import { LikesPostsStatus, likesPostsStatusSchema } from "../posts/domain/likesPost-schema-Model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: LikesPostsStatus.name, schema: likesPostsStatusSchema }
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepositories,
    BlogsQueryRepositories,
    PostsRepositories,
    PostsQueryRepositories,
  ],
})
export class BlogModule {}
