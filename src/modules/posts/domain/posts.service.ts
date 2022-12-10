import { Injectable } from "@nestjs/common";
import { PostsRepositories } from "../infrastructure/posts-repositories";
import { BlogsQueryRepositories } from "../../blogs/infrastructure/query-repository/blogs-query.repositories";
import { CreatePostDto } from "../api/input-Dtos/create-Post-Dto-Model";
import { PreparationPostForDB } from "./post-preparation-for-DB";
import { PostViewModel } from "../infrastructure/query-repositories/post-View-Model";
import { NotFoundExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { CommentsRepositories } from "../../comments/infrastructure/comments.repositories";
import { UsersQueryRepositories } from "../../users/infrastructure/query-reposirory/users-query.reposit";
import { PreparationCommentForDB } from "../../comments/domain/comment-preparation-for-DB";
import { CommentsViewType } from "../../comments/infrastructure/comments-View-Model";


@Injectable()
export class PostsService {
  constructor(protected postsRepositories: PostsRepositories,
              protected blogsQueryRepositories: BlogsQueryRepositories,
              protected commentsRepositories: CommentsRepositories,
              protected usersQueryRepositories: UsersQueryRepositories) {
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

  async updateLikeStatus(id: string, likeStatus: string, userId: string): Promise<boolean> {
    const post = await this.postsRepositories.findPost(id)
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`)
    const user = await this.usersQueryRepositories.findUser(userId)
    return this.postsRepositories.updateStatusPostById(id, userId, likeStatus, user.login)
  }



  async createComment(id: string, content: string, userId: string): Promise<CommentsViewType> {
    const post = await this.postsRepositories.findPost(id)
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`)
    const user = await this.usersQueryRepositories.findUser(userId)
    const newComment = new PreparationCommentForDB(
      post._id.toString(),
      content,
      userId,
      user.login,
      new Date().toISOString())
    return await this.commentsRepositories.createCommentByIdPost(newComment)
  }
}
