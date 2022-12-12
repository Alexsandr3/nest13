import { Injectable } from "@nestjs/common";

@Injectable()
export class BlogsService {
  constructor() {
  }

  /*async createBlog(blogInputModel: CreateBlogDto): Promise<string> {
    //preparation Blog for save in DB
    const newBlog = new PreparationBlogForDB(
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
      new Date().toISOString()
    );
    return await this.blogsRepositories.createBlog(newBlog);
  }*/

  /*async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogsRepositories.deleteBlog(id);
    if (!result) throw new NotFoundExceptionMY(`Not found for id:${id}`);
    return true;
  }*/

  /*async updateBlog(id: string, blogInputModel: UpdateBlogDto): Promise<boolean> {
    const result = await this.blogsRepositories.updateBlog(id, blogInputModel);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    return true;
  }*/

  /*async createPost(postInputModel: CreatePostByBlogIdDto, blogId: string, blogName: string): Promise<PostViewModel> {
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
  }*/
}
