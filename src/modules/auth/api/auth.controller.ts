import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  HttpCode, UseGuards
} from "@nestjs/common";
import { AuthService } from "../domain/auth.service";
import { CurrentUserId } from "../decorators/current-user-id.param.decorator";
import { UsersService } from "../../users/domain/users.service";
import { CreateUserDto } from "../../users/api/input-Dto/create-User-Dto-Model";
import { ConfirmationCodeDto } from "../../users/api/input-Dto/confirmation-code-Dto-Model";
import { LoginDto } from "./dto/login-Dto-Model";
import { EmailRecoveryDto } from "./dto/email-Recovery-Dto-Model";
import { NewPasswordDto } from "./dto/new-Password-Dto-Model";
import { TokensType } from "../application/jwt.service";
import { response } from "express";
import { JwtRefreshTokenStrategy } from "../strategies/jwt-Refresh.strategy";
import JwtRefreshGuard from "../guard/jwt-Refresh.guard";
import { PayloadType } from "../application/payloadType";


@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService) {
  }


  @Post(`/login`)
  async login(@Request() req, @Body() loginInputModel: LoginDto): Promise<Pick<TokensType, "accessToken">> {
    const ipAddress = req.ip;
    const deviceName = req.headers["user-agent"];
    console.log("loginInputModel", loginInputModel);
    const createdToken = await this.authService.login(loginInputModel, ipAddress, deviceName);
    response.cookie("refreshToken", createdToken.refreshToken, { httpOnly: true, secure: true });
    return { "accessToken": createdToken.accessToken };
  }

  @Post(`/password-recovery`)
  @HttpCode(204)
  async recovery(@Body() inputData: EmailRecoveryDto): Promise<boolean> {
    return await this.usersService.recovery(inputData.email);
  }

  @Post(`/new-password`)
  @HttpCode(204)
  async newPassword(@Body() newPasswordData: NewPasswordDto): Promise<boolean> {
    return await this.usersService.newPassword(newPasswordData.newPassword, newPasswordData.recoveryCode);
  }

  @UseGuards(JwtRefreshGuard) //payload
  @Post(`refresh-token`)
  async refresh(@Request() payload: PayloadType): Promise<Pick<TokensType, "accessToken">> {
    console.log("payload", payload);
    const createdToken = await this.usersService.refresh(payload);
    response.cookie("refreshToken", createdToken.refreshToken, { httpOnly: true, secure: true });
    return { "accessToken": createdToken.accessToken };
  }

  @Post(`/registration-confirmation`)
  @HttpCode(204)
  async confirmByCode(@Body() inputModel: ConfirmationCodeDto): Promise<boolean> {
    await this.usersService.confirmByCode(inputModel.code);
    return;
  }

  @Post(`/registration`)
  @HttpCode(204)
  async registration(@Body() userInputModel: CreateUserDto): Promise<boolean> {
    await this.usersService.createUser(userInputModel);
    return;
  }

  @Post(`/registration-email-resending`)
  @HttpCode(204)
  async resending(@Body() resendingInputModel: EmailRecoveryDto): Promise<boolean> {
    await this.usersService.resending(resendingInputModel.email);
    return;
  }

  @UseGuards(JwtRefreshGuard)
  @Post(`/logout`)
  @HttpCode(204)
  async logout(@Request() payload: PayloadType): Promise<boolean> {
    await this.usersService.logout(payload);
    return;
  }

  //@UseGuards(JwtAuthGuard) //payload
  @Get(`me`)
  async getProfile(@CurrentUserId() currentUserId) {
    //check userId
    // return await this.usersService.findUser(currentUserId)
  }

}
