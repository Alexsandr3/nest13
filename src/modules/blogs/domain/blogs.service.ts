import { Injectable } from "@nestjs/common";
import { BlogsRepositories } from "../infrastructure/blogs.repositories";
import { CreateBlogDto } from "../api/input-Dtos/create-Blog-Dto-Model";
import { CreatePostByBlogIdDto } from "../../posts/api/input-Dtos/create-Post-By-BlogId-Dto-Model";
import { PostsRepositories } from "../../posts/infrastructure/posts-repositories";
import { PostViewModel } from "../../posts/infrastructure/query-repositories/post-View-Model";
import { PreparationBlogForDB } from "./blog-preparation-for-DB";
import { PreparationPostForDB } from "../../posts/domain/post-preparation-for-DB";
import { UpdateBlogDto } from "../api/input-Dtos/update-Blog-Dto-Model";
import { NotFoundExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { PostsQueryRepositories } from "../../posts/infrastructure/query-repositories/posts-query.reposit";

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepositories: BlogsRepositories,
              private readonly postsRepositories: PostsRepositories,
              private readonly postsQueryRepositories: PostsQueryRepositories) {
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

  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsRepositories.deleteBlog(id);
    if (!result) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }

  async updateBlog(id: string, blogInputModel: UpdateBlogDto): Promise<boolean> {
    const result = await this.blogsRepositories.updateBlog(id, blogInputModel);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    return true;
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
    const createdPost = await this.postsRepositories.createPost(newPost);
    return await this.postsQueryRepositories.createPostForView(createdPost);
  }
}
