import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogModule } from "./modules/blogs/blog.module";
import { PostModule } from "./modules/posts/post.module";
import { CommentModule } from "./modules/comments/comment.module";
import { UserModule } from "./modules/users/user.module";
import { MailModule } from "./modules/mail/mail.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TestingModule } from "./modules/testing/testing.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    BlogModule,
    PostModule,
    CommentModule,
    UserModule,
    MailModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true}), // no need to import into other modules,
    TestingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
