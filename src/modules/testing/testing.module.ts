import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blogger/domain/blog-schema-Model';
import { Post, PostSchema } from '../posts/domain/post-schema-Model';
import { User, UserSchema } from '../users/domain/users-schema-Model';
import { TestingController } from './testins.controller';
import {
  Comment,
  CommentSchema,
} from '../comments/domain/comments-schema-Model';
import { TestingService } from './testing.service';
import { Device, DeviceSchema } from '../security/domain/device-schema-Model';
import {
  LikesStatus,
  LikesStatusSchema,
} from '../comments/domain/likesStatus-schema-Model';
import {
  LikesPostsStatus,
  LikesPostsStatusSchema,
} from '../posts/domain/likesPost-schema-Model';
import {
  UserBanInfo,
  UserBanInfoSchema,
} from '../users/domain/users-ban-info-schema-Model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: LikesStatus.name, schema: LikesStatusSchema },
      { name: LikesPostsStatus.name, schema: LikesPostsStatusSchema },
      { name: UserBanInfo.name, schema: UserBanInfoSchema },
    ]),
  ],

  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
