import { Module } from '@nestjs/common';
import { PostsService } from './domain/posts.service';
import { PostsRepositories } from './infrastructure/posts-repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/post-schema-Model';
import { PostsController } from './api/posts.controller';
import { PostsQueryRepositories } from './infrastructure/query-repositories/posts-query.reposit';
import {
  LikePost,
  LikePostSchema,
} from './domain/likePost-schema-Model';
import { BlogsQueryRepositories } from '../blogs/infrastructure/query-repository/blogs-query.repositories';
import { Blog, BlogSchema } from '../blogger/domain/blog-schema-Model';
import {
  Comment,
  CommentSchema,
} from '../comments/domain/comments-schema-Model';
import { CommentsQueryRepositories } from '../comments/infrastructure/query-repository/comments-query.repositories';
import { JwtAuthGuard } from '../../guards/jwt-auth-bearer.guard';
import { CommentsRepositories } from '../comments/infrastructure/comments.repositories';
import { UsersQueryRepositories } from '../users/infrastructure/query-reposirory/users-query.reposit';
import {
  LikeComment,
  LikeCommentSchema,
} from '../comments/domain/likeComment-schema-Model';
import { User, UserSchema } from '../users/domain/users-schema-Model';
import { JwtService } from '../auth/application/jwt.service';
import { BasicAuthGuard } from '../../guards/basic-auth.guard';
import { JwtForGetGuard } from '../../guards/jwt-auth-bearer-for-get.guard';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentHandler } from './application/use-cases/handlers/create-comment-handler';
import { UpdateLikeStatusHandler } from './application/use-cases/handlers/update-like-status-handler';
import { BlogBanInfo, BlogBanInfoSchema } from "../blogger/domain/ban-user-for-current-blog-schema-Model";
import { BlogsRepositories } from "../blogs/infrastructure/blogs.repositories";
import { UsersRepositories } from "../users/infrastructure/users-repositories";

const handlers = [CreateCommentHandler, UpdateLikeStatusHandler];
const adapters = [
  PostsRepositories,
  PostsQueryRepositories,
  BlogsRepositories,
  BlogsQueryRepositories,
  CommentsRepositories,
  CommentsQueryRepositories,
  UsersRepositories,
  UsersQueryRepositories,
  JwtService,
];
const guards = [JwtAuthGuard, BasicAuthGuard, JwtForGetGuard];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: LikePost.name, schema: LikePostSchema },
      { name: LikeComment.name, schema: LikeCommentSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: BlogBanInfo.name, schema: BlogBanInfoSchema },
    ]),
    CqrsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    ...guards,
    ...adapters,
    ...handlers,
  ],
})
export class PostModule {}
