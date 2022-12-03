import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller(`users`)
export class UsersController {
  @Get()
  getBlogs() {}

  @Post
  createBlog(@Body() BlogInputModel: BodyParams_BlogInputModel) {}
  /* @Get
  findBlogs() {}
  @Get
  findPostsByIdBlog() {}
  @Post
  createPostsByIdBlog() {}
  @Put
  updateBlogs() {}
  @Delete
  deleteBlog() {}*/
}

type BodyParams_BlogInputModel = {
  /**
   * name: Blog name
   */
  name: string;
  /**
   * description
   */
  description: string;
  /**
   * websiteUrl: Blog website Url
   */
  websiteUrl: string;
};
