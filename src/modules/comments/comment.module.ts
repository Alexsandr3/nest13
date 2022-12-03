import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from "./domain/comments-schema-Model";
import { CommentsQueryRepositories } from "./infrastructure/comments-query.repositories";
import { CommentsController } from "./api/comments.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema }
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsQueryRepositories],
})
export class CommentModule {}
