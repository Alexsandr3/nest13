import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogModule } from "./blogs/blog.module";
import { PostModule } from "./posts/post.module";
import { CommentModule } from "./comments/comment.module";
import { UserModule } from "./users/user.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TestingModule } from "./testing/testing.module";

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
