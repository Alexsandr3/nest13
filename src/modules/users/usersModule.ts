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
import { BasicAuthGuard } from "../auth/guard/basic-auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema }
    ]),
    MailModule
  ],

  controllers: [UsersController],
  providers: [UsersService, UsersRepositories, UsersQueryRepositories, JwtService, DeviceRepositories, MailService, BasicAuthGuard],
  exports: [UsersRepositories]
})
export class UsersModule {
}
