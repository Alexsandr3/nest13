import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./api/users.controller";
import { User, UserSchema } from "./domain/users-schema-Model";
import { UsersRepositories } from "./infrastructure/users-repositories";
import { UsersQueryRepositories } from "./infrastructure/users-query.reposit";
import { UsersService } from "./domain/users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepositories, UsersQueryRepositories]
})
export class UserModule {
}
