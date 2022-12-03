import { Injectable } from "@nestjs/common";
import { PostsRepositories } from "../infrastructure/posts-repositories";
import { BlogsQueryRepositories } from "../../blogs/infrastructure/blogs-query.repositories";
import { CreatePostDto } from "../api/input-Dtos/create-Post-Dto-Model";
import { PreparationPostForDB } from "./post-preparation-for-DB";
import { PostViewModel } from "../infrastructure/post-View-Model";

@Injectable()
export class PostsService {
  constructor(protected postsRepositories: PostsRepositories,
              private blogsQueryRepositories: BlogsQueryRepositories) {
  }

  async createPost(postInputModel: CreatePostDto): Promise<PostViewModel> {
    const blog = await this.blogsQueryRepositories.findBlog(postInputModel.blogId);
    const newPost = new PreparationPostForDB(
      postInputModel.title,
      postInputModel.shortDescription,
      postInputModel.content,
      postInputModel.blogId,
      blog.name,
      new Date().toISOString()
    );
    return  await this.postsRepositories.createPost(newPost);
  }

  async removePost(id: string): Promise<boolean> {
    return await this.postsRepositories.deletePost(id);
  }

  async updatePost(id: string, blogInputModel: CreatePostDto): Promise<boolean> {
    return await this.postsRepositories.updatePost(id, blogInputModel);
  }
}
