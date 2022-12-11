import { Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { UsersModule } from "../users/usersModule";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { JwtService } from "./application/jwt.service";
import { UsersService } from "../users/domain/users.service";
import { DeviceRepositories } from "../security/infrastructure/device-repositories";
import { UsersQueryRepositories } from "../users/infrastructure/query-reposirory/users-query.reposit";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/domain/users-schema-Model";
import { Device, DeviceSchema } from "../security/domain/device-schema-Model";
import { RefreshGuard } from "../../guards/jwt-auth-refresh.guard";
import { JwtAuthGuard } from "../../guards/jwt-auth-bearer.guard";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { UsersRepositories } from "../users/infrastructure/users-repositories";


@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema }
    ]),
    /*    JwtModule.register({
          secret: settings.ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: '15m' },
        }),*/
    MailModule,
    UsersModule],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtService, DeviceRepositories,
    UsersRepositories, UsersQueryRepositories, RefreshGuard, JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [JwtService]
})
export class AuthModule {
}
