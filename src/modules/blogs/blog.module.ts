import { Module } from '@nestjs/common';
import { BlogsService } from './domain/blogs.service';
import { BlogsRepositories } from './infrastructure/blogs.repositories';
import { BlogsController } from './api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog-schema-Model';
import { BlogsQueryRepositories } from './infrastructure/query-repository/blogs-query.repositories';
import { PostsRepositories } from '../posts/infrastructure/posts-repositories';
import { Post, PostSchema } from "../posts/domain/post-schema-Model";
import { PostsQueryRepositories } from "../posts/infrastructure/query-repositories/posts-query.reposit";
import { Comment, CommentSchema } from "../comments/domain/comments-schema-Model";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      //{ name: LikesPostsStatus.name, schema: likesPostsStatusSchema }
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
