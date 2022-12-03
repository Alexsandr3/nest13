import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blogs/blog.module';
import { PostModule } from './posts/post.module';
import { CommentModule } from "./comments/comment.module";
import { UserModule } from "./users/user.module";
import { MailModule } from './mail/mail.module';
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@nestjs.vw3gy4j.mongodb.net/?retryWrites=true&w=majority`,
    ),
    BlogModule,
    PostModule,
    CommentModule,
    UserModule,
    MailModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
