import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogModule } from "./modules/blogs/blog.module";
import { PostModule } from "./modules/posts/post.module";
import { CommentModule } from "./modules/comments/comment.module";
import { UsersModule } from "./modules/users/usersModule";
import { MailModule } from "./modules/mail/mail.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { TestingModule } from "./modules/testing/testing.module";
import { DeviceModule } from "./modules/security/device.module";
import { ThrottlerModule } from "@nestjs/throttler";


@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    BlogModule,
    PostModule,
    CommentModule,
    UsersModule,
    MailModule,
    AuthModule,
    DeviceModule,
    ConfigModule.forRoot({ isGlobal: true}), // no need to import into other modules,
    TestingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
