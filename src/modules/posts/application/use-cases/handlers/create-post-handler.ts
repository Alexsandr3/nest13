import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../create-post-command";
import { PostsRepositories } from "../../../infrastructure/posts-repositories";
import { PostsQueryRepositories } from "../../../infrastructure/query-repositories/posts-query.reposit";
import { PostViewModel } from "../../../infrastructure/query-repositories/post-View-Model";
import { PreparationPostForDB } from "../../../domain/post-preparation-for-DB";


@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postsRepositories: PostsRepositories,
              private readonly postsQueryRepositories: PostsQueryRepositories) {
  }

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const { blogName } = command;
    const { title, shortDescription, content, blogId } = command.postInputModel;
    //preparation Post for save in DB
    const newPost = new PreparationPostForDB(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      new Date().toISOString()
    );
    const createdPost = await this.postsRepositories.createPost(newPost);
    return await this.postsQueryRepositories.createPostForView(createdPost);
  }
}


