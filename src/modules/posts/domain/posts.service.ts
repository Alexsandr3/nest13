import { Injectable } from "@nestjs/common";
import { PostsRepositories } from "../infrastructure/posts-repositories";
import { BlogsQueryRepositories } from "../../blogs/infrastructure/query-repository/blogs-query.repositories";
import { CreatePostDto } from "../api/input-Dtos/create-Post-Dto-Model";
import { PreparationPostForDB } from "./post-preparation-for-DB";
import { PostViewModel } from "../infrastructure/query-repositories/post-View-Model";
import { NotFoundExceptionMY } from "../../../helpers/My-HttpExceptionFilter";


@Injectable()
export class PostsService {
  constructor(protected postsRepositories: PostsRepositories,
              private blogsQueryRepositories: BlogsQueryRepositories) {
  }

  async createPost(postInputModel: CreatePostDto): Promise<PostViewModel> {
    //finding Blog
    const blog = await this.blogsQueryRepositories.findBlog(postInputModel.blogId);
    //preparation Post for save in DB
    const newPost = new PreparationPostForDB(
      postInputModel.title,
      postInputModel.shortDescription,
      postInputModel.content,
      postInputModel.blogId,
      blog.name,
      new Date().toISOString()
    );
    return await this.postsRepositories.createPost(newPost);
  }

  async removePost(id: string): Promise<boolean> {
    const res = await this.postsRepositories.deletePost(id);
    if (!res) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }

  async updatePost(id: string, postInputModel: CreatePostDto): Promise<boolean> {
    const res = await this.postsRepositories.updatePost(id, postInputModel);
    if (!res) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }

  /*async updateLikeStatus(id: string, likeStatus: LikeStatusType): Promise<boolean> {
    const post = await this.postsRepositories.findPost(id)
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`)
    return this.postsRepositories.updateStatusPostById(id, likeStatus)
  }*/
  /*async createComment(id: string, content: string, userId: string, userLogin: string): Promise<CommentsViewType | null> {
    const post = await this.postsRepositories.findPost(id)
    if (!post) return null
    return await this.commentsRepositories.createCommentByIdPost(post._id, content, userId, userLogin)
  }*/
}
