import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blogs/blog.module';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@nestjs.vw3gy4j.mongodb.net/?retryWrites=true&w=majority`,
    ),
    BlogModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
