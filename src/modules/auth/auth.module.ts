import { Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { UsersModule } from "../users/usersModule";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { JwtService } from "./application/jwt.service";
import { JwtRefreshTokenStrategy } from "./strategies/jwt-Refresh.strategy";
import { UsersService } from "../users/domain/users.service";
import { DeviceRepositories } from "../security/infrastructure/device-repositories";
import { UsersQueryRepositories } from "../users/infrastructure/query-reposirory/users-query.reposit";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/domain/users-schema-Model";
import { Device, DeviceSchema } from "../security/domain/device-schema-Model";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema }
    ]),
    MailModule,
    UsersModule],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtService, JwtRefreshTokenStrategy, DeviceRepositories, UsersQueryRepositories],
  exports: [JwtService]
})
export class AuthModule {
}
