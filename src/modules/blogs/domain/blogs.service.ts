import { HttpException, Injectable } from "@nestjs/common";
import { BlogsRepositories } from "../infrastructure/blogs.repositories";
import { CreateBlogDto } from "../api/input-Dtos/create-Blog-Dto-Model";
import { CreatePostByBlogIdDto } from "../api/input-Dtos/create-Post-By-BlogId-Dto-Model";
import { PostsRepositories } from "../../posts/infrastructure/posts-repositories";
import { PostViewModel } from "../../posts/infrastructure/post-View-Model";
import { PreparationBlogForDB } from "./blog-preparation-for-DB";
import { PreparationPostForDB } from "../../posts/domain/post-preparation-for-DB";
import { UpdateBlogDto } from "../api/input-Dtos/update-Blog-Dto-Model";

@Injectable()
export class BlogsService {
  constructor(protected blogsRepositories: BlogsRepositories,
              protected postsRepositories: PostsRepositories) {
  }

  async createBlog(blogInputModel: CreateBlogDto): Promise<string> {
    //preparation Blog for save in DB
    const newBlog = new PreparationBlogForDB(
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
      new Date().toISOString()
    );
    return await this.blogsRepositories.createBlog(newBlog);
  }

  async removeBlog(id: string): Promise<boolean> {
    const res = await this.blogsRepositories.deleteBlog(id);
    if(!res) throw new HttpException("Incorrect id,  please enter a valid one", 404);
    return true
  }

  async updateBlog(id: string, blogInputModel: UpdateBlogDto): Promise<boolean> {
    const res =  await this.blogsRepositories.updateBlog(id, blogInputModel);
    if(!res) throw new HttpException("Incorrect id,  please enter a valid one", 404);
    return true
  }

  async createPost(postInputModel: CreatePostByBlogIdDto, blogId: string, blogName: string): Promise<PostViewModel> {
    //preparation Post for save in DB
    const newPost = new PreparationPostForDB(
      postInputModel.title,
      postInputModel.shortDescription,
      postInputModel.content,
      blogId,
      blogName,
      new Date().toISOString()
    );
    return await this.postsRepositories.createPost(newPost);
  }
}
