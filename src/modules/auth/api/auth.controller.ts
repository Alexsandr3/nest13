import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  HttpCode, UseGuards, Res, Ip
} from "@nestjs/common";
import { AuthService } from "../domain/auth.service";
import { UsersService } from "../../users/domain/users.service";
import { CreateUserDto } from "../../users/api/input-Dto/create-User-Dto-Model";
import { ConfirmationCodeDto } from "../../users/api/input-Dto/confirmation-code-Dto-Model";
import { LoginDto } from "./dto/login-Dto-Model";
import { EmailRecoveryDto } from "./dto/email-Recovery-Dto-Model";
import { NewPasswordDto } from "./dto/new-Password-Dto-Model";
import { TokensType } from "../application/jwt.service";
import { PayloadType } from "../application/payloadType";
import { RefreshGuard } from "../guard/jwt-refresh-Auth.guard";
import { Response } from "express";
import { PayloadRefresh } from "../decorators/payload-refresh.param.decorator";
import { JwtAuthGuard } from "../guard/jwt-auth-bearer.guard";
import { UsersQueryRepositories } from "../../users/infrastructure/query-reposirory/users-query.reposit";
import { MeViewModel } from "../infrastructure/me-View-Model";
import { CurrentUserId } from "../decorators/current-user-id.param.decorator";


@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService,
              private readonly usersQueryRepositories: UsersQueryRepositories) {
  }


  @HttpCode(204)
  @Post(`/password-recovery`)
  async recovery(@Body() inputData: EmailRecoveryDto): Promise<boolean> {
    return await this.usersService.recovery(inputData.email);
  }

  @HttpCode(204)
  @Post(`/new-password`)
  async newPassword(@Body() newPasswordData: NewPasswordDto): Promise<boolean> {
    return await this.usersService.newPassword(newPasswordData.newPassword, newPasswordData.recoveryCode);
  }

  @HttpCode(200)
  @Post(`/login`)
  async login(@Request() req, @Ip() ip, @Body() loginInputModel: LoginDto,
              @Res({ passthrough: true }) res: Response): Promise<Pick<TokensType, "accessToken">> {
    const deviceName = req.headers["user-agent"];
    const createdToken = await this.authService.login(loginInputModel, ip, deviceName);
    res.cookie("refreshToken", createdToken.refreshToken, { httpOnly: true, secure: true });
    return { "accessToken": createdToken.accessToken };
  }

  @UseGuards(RefreshGuard)
  @Post(`refresh-token`)
  async refresh(@PayloadRefresh() payloadRefresh: PayloadType,
                @Res({ passthrough: true }) res): Promise<Pick<TokensType, "accessToken">> {
    const createdToken = await this.usersService.refresh(payloadRefresh);
    res.cookie("refreshToken", createdToken.refreshToken, { httpOnly: true, secure: true });
    return { "accessToken": createdToken.accessToken };
  }

  @HttpCode(204)
  @Post(`/registration-confirmation`)
  async confirmByCode(@Body() inputModel: ConfirmationCodeDto): Promise<boolean> {
    return await this.usersService.confirmByCode(inputModel.code);
  }

  @HttpCode(204)
  @Post(`/registration`)
  async registration(@Body() userInputModel: CreateUserDto): Promise<boolean> {
    await this.usersService.createUser(userInputModel);
    return;
  }

  @HttpCode(204)
  @Post(`/registration-email-resending`)
  async resending(@Body() resendingInputModel: EmailRecoveryDto): Promise<boolean> {
    return await this.usersService.resending(resendingInputModel.email);
  }

  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Post(`/logout`)
  async logout(@PayloadRefresh() payloadRefresh: PayloadType): Promise<boolean> {
    return await this.usersService.logout(payloadRefresh);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`me`)
  async getProfile(@CurrentUserId() userId: string): Promise<MeViewModel> {
    return await this.usersQueryRepositories.getUserById(userId);
  }

}
