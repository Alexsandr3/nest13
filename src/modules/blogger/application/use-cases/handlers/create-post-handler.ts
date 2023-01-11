import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../create-post-command";
import { PostViewModel } from "../../../../posts/infrastructure/query-repositories/post-View-Model";
import { PostsRepositories } from "../../../../posts/infrastructure/posts-repositories";
import { PostsQueryRepositories } from "../../../../posts/infrastructure/query-repositories/posts-query.reposit";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../../../helpers/My-HttpExceptionFilter";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument } from "../../../../posts/domain/post-schema-Model";
import { Model } from "mongoose";

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly blogsRepositories: BlogsRepositories,
    private readonly postsRepositories: PostsRepositories,
    private readonly postsQueryRepositories: PostsQueryRepositories
  ) {
  }

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const { userId, blogId } = command;
    const { title, shortDescription, content } = command.postInputModel;
    const blog = await this.blogsRepositories.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))  throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    if (blog.checkStatusBan()) throw new NotFoundExceptionMY(`Not found data for id: ${blogId}`);
    //preparation post
    const newPost = Post.createPost(userId, title, shortDescription, content, blogId, blog.getName());
    //create instance
    const post = new this.postModel(newPost);
    //save instance
    const createdPost = await this.postsRepositories.savePost(post);
    //mapped for view
    return await this.postsQueryRepositories.createPostForView(createdPost);
  }
}
