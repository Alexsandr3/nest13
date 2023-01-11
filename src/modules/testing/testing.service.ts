import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogger/domain/blog-schema-Model';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from '../comments/domain/comments-schema-Model';
import { Post, PostDocument } from '../posts/domain/post-schema-Model';
import { User, UserDocument } from '../users/domain/users-schema-Model';
import { Device, DeviceDocument } from '../security/domain/device-schema-Model';
import {
  LikePost,
  LikePostDocument,
} from '../posts/domain/likePost-schema-Model';
import {
  LikeComment,
  LikeCommentDocument,
} from '../comments/domain/likeComment-schema-Model';
import { BlogBanInfo, BlogBanInfoDocument } from "../blogger/domain/ban-user-for-current-blog-schema-Model";

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private readonly blogsModel: Model<BlogDocument>,
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
    @InjectModel(LikeComment.name)
    private readonly likesStatusModel: Model<LikeCommentDocument>,
    @InjectModel(LikePost.name)
    private readonly likesPostsStatusModel: Model<LikePostDocument>,
    @InjectModel(BlogBanInfo.name) private readonly blogBanInfoModel: Model<BlogBanInfoDocument>
  ) {}
  async deleteAll() {
    await this.blogsModel.deleteMany();
    await this.postModel.deleteMany();
    await this.userModel.deleteMany();
    await this.commentsModel.deleteMany();
    await this.deviceModel.deleteMany();
    await this.likesStatusModel.deleteMany();
    await this.likesPostsStatusModel.deleteMany();
    await this.blogBanInfoModel.deleteMany();
    return;
  }
}
