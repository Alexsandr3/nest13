import { Module } from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import { BlogsReposit } from './infrastructure/blogs.reposit';
import { BlogsController } from './api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './models/blog-schema';
import { BlogsQueryRepositories } from './infrastructure/blogs.query.reposit';
import { PaginationRepositories } from '../for-pagination/pagination.repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsReposit,
    BlogsQueryRepositories,
    PaginationRepositories,
  ],
})
export class BlogModule {}
