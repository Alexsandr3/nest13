import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsReposit } from './blogs/infrastructure/blogs.reposit';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@nestjs.vw3gy4j.mongodb.net/?retryWrites=true&w=majority`,
    ),
  ],
  controllers: [AppController, BlogsController],
  providers: [AppService, BlogsService, BlogsReposit],
})
export class AppModule {}
