import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from "./domain/comments-schema-Model";
import { CommentsQueryRepositories } from "./infrastructure/query-repository/comments-query.repositories";
import { CommentsController } from "./api/comments.controller";
import { LikesStatus, likesStatusSchema } from "./domain/likesStatus-schema-Model";
import { CommentsService } from "./domain/comments.service";
import { CommentsRepositories } from "./infrastructure/comments.repositories";
import { JwtAuthGuard } from "../auth/guard/jwt-auth-bearer.guard";
import { JwtService } from "../auth/application/jwt.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: LikesStatus.name, schema: likesStatusSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsQueryRepositories, CommentsService, CommentsRepositories, JwtAuthGuard, JwtService],
})
export class CommentModule {}
