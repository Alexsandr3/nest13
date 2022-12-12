import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePostCommand } from "../create-post-command";
import { PostViewModel } from "../../../../posts/infrastructure/query-repositories/post-View-Model";
import { PreparationPostForDB } from "../../../../posts/domain/post-preparation-for-DB";
import { PostsRepositories } from "../../../../posts/infrastructure/posts-repositories";
import { PostsQueryRepositories } from "../../../../posts/infrastructure/query-repositories/posts-query.reposit";


@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postsRepositories: PostsRepositories,
              private readonly postsQueryRepositories: PostsQueryRepositories) {
  }

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const { blogName } = command;
    const { blogId } = command;
    const { title, shortDescription, content } = command.postInputModel;
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


