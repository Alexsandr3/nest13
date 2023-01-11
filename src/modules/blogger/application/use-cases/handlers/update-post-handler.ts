import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY
} from "../../../../../helpers/My-HttpExceptionFilter";
import { UpdatePostCommand } from "../update-post-command";
import { PostsRepositories } from "../../../../posts/infrastructure/posts-repositories";
import { BlogsRepositories } from "../../../../blogs/infrastructure/blogs.repositories";

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepositories: PostsRepositories,
    private readonly blogsRepositories: BlogsRepositories
  ) {
  }

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { postId, blogId, userId } = command;
    const { title, shortDescription, content } = command.postInputModel;
    //finding blog
    const blog = await this.blogsRepositories.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    //finding post
    const post = await this.postsRepositories.getPost(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found post with id: ${postId}`);
    //update post
    post.updatePost(title, shortDescription, content, blogId);
    //save updated post
    await this.postsRepositories.savePost(post);
    return true;
  }
}
