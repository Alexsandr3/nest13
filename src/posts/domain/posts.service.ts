import { Injectable } from '@nestjs/common';
import { PostsRepositories } from '../infrastructure/posts-repositories';
import { CreatePostDto } from '../dto/create-Post-Dto-Model';
import {
  CreatePostDBModel,
  mapperForPostViewModel,
  PostViewModel,
} from '../models/postViewModel';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/blogs-query.repositories';
import { ExtendedLikesInfoViewModel } from '../models/likesInfoViewModel';
import { LikeStatusType } from '../models/likes-post-schema';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepositories: PostsRepositories,
    private blogsQueryRepositories: BlogsQueryRepositories,
  ) {}

  async createPost(
    postInputModel: CreatePostDto,
  ): Promise<mapperForPostViewModel> {
    const blog = await this.blogsQueryRepositories.findBlog(
      postInputModel.blogId,
    );
    const newPost = new CreatePostDBModel(
      postInputModel.title,
      postInputModel.shortDescription,
      postInputModel.content,
      postInputModel.blogId,
      blog.name,
      new Date().toISOString(),
    );
    const post = await this.postsRepositories.createPost(newPost);
    const postId = post._id.toString();
    const newestLikes = await this.postsRepositories.newestLikes(postId);
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(
      0,
      0,
      LikeStatusType.None,
      newestLikes,
    );
    return;
  }

  async removePost(id: string): Promise<boolean> {
    return await this.postsRepositories.deletePost(id);
  }

  /*

  async updateBlog(
    id: string,
    blogInputModel: CreateBlogDto,
  ): Promise<boolean> {
    return await this.postsReposit.updateBlog(id, blogInputModel);
  }*/
}
