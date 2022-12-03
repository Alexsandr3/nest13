import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto } from '../dto/create-Blog-Dto-Model';
import { BlogsQueryRepositories } from '../infrastructure/blogs.query.reposit';
import { mapperForBlogViewModel } from '../models/blogViewModel';
import { PaginationDto } from '../dto/pagination-Dto-Model';
import { PaginationRepositories } from '../../for-pagination/pagination.repositories';
import { BlogsViewType } from '../entities/blogViewModel';
import { UpdateBlogDto } from '../dto/update-Blog-Dto-Model';

@Controller(`blogs`)
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected blogsQueryRepositories: BlogsQueryRepositories,
    protected paginationRepositories: PaginationRepositories,
  ) {}

  @Post()
  async createBlog(
    @Body() blogInputModel: CreateBlogDto,
  ): Promise<mapperForBlogViewModel> {
    return this.blogsService.createBlog(blogInputModel);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const foundBlogs = await this.blogsQueryRepositories.findBlogs(pagination);
    const countDocuments = await this.blogsQueryRepositories.countDocuments(
      pagination,
    );
    const mappedBlogs = foundBlogs.map(
      (blog) => new mapperForBlogViewModel(blog),
    );
    const withPagination = await this.paginationRepositories.withPagination(
      pagination,
      mappedBlogs,
      countDocuments,
    );
    return withPagination;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogsViewType | null> {
    const foundBlog = await this.blogsQueryRepositories.findBlog(id);
    return new mapperForBlogViewModel(foundBlog);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.blogsService.removeBlog(id);
  }

  @Put(`:id`)
  async updateBlog(
    @Param('id') id: string,
    @Query() blogInputModel: UpdateBlogDto,
  ): Promise<boolean> {
    return await this.blogsService.updateBlog(id, blogInputModel);
  }
}
