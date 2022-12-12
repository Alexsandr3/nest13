import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./api/users.controller";
import { User, UserSchema } from "./domain/users-schema-Model";
import { UsersRepositories } from "./infrastructure/users-repositories";
import { UsersQueryRepositories } from "./infrastructure/query-reposirory/users-query.reposit";
import { UsersService } from "./domain/users.service";
import { JwtService } from "../auth/application/jwt.service";
import { DeviceRepositories } from "../security/infrastructure/device-repositories";
import { MailService } from "../mail/mail.service";
import { Device, DeviceSchema } from "../security/domain/device-schema-Model";
import { MailModule } from "../mail/mail.module";
import { BasicAuthGuard } from "../../guards/basic-auth.guard";
import { CreateUserHandler } from "./application/use-cases/handlers/create-user-handler";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteUserCommand } from "./application/use-cases/delete-user-command";

const handlers = [CreateUserHandler, DeleteUserCommand];
const adapters = [JwtService, MailService, UsersRepositories, UsersQueryRepositories, DeviceRepositories];
const guards = [BasicAuthGuard];


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema }
    ]),
    MailModule,
    CqrsModule
  ],

  controllers: [UsersController],
  providers: [UsersService, ...guards, ...adapters, ...handlers],
  exports: [UsersRepositories]
})
export class UsersModule {
}
