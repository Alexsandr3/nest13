import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import * as bcrypt from "bcrypt";
import { UnauthorizedExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { JwtService, TokensType } from "../application/jwt.service";
import { LoginDto } from "../api/dto/login-Dto-Model";
import { randomUUID } from "crypto";
import { DeviceRepositories } from "../../security/infrastructure/device-repositories";
import { PreparationDeviceForDB } from "../../security/domain/device-preparation-for-DB";
import { UsersRepositories } from "../../users/infrastructure/users-repositories";
import { UsersDBType } from "../../users/domain/user-DB-Type";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly deviceRepositories: DeviceRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  private async validateUser(loginInputModel: LoginDto): Promise<UsersDBType> {
    //find user by login or email
    const user = await this.usersRepositories.findByLoginOrEmail(loginInputModel.loginOrEmail);
    if (!user) throw new UnauthorizedExceptionMY(`User '${loginInputModel.loginOrEmail}' is not authorized `);
    //check passwordHash
    const result = await bcrypt.compare(loginInputModel.password, user.accountData.passwordHash);
    if (!result) throw new UnauthorizedExceptionMY(`Incorrect password`);
    return user;
  }

  async login(loginInputModel: LoginDto, ipAddress: string, deviceName: string): Promise<TokensType> {
    const user = await this.validateUser(loginInputModel);
    //preparation data for token
    const deviceId = randomUUID();
    const userId = user._id.toString();
    //generation of a new pair of tokens
    const token = await this.jwtService.createJwt(userId, deviceId);
    const payloadNew = await this.jwtService.verifyRefreshToken(token.refreshToken);
    //preparation data for save device
    const dateCreatedToken = (new Date(payloadNew.iat * 1000)).toISOString();
    const dateExpiredToken = (new Date(payloadNew.exp * 1000)).toISOString();
    const device = new PreparationDeviceForDB(
      userId,
      ipAddress,
      deviceName,
      dateCreatedToken,
      dateExpiredToken,
      deviceId
    );
    await this.deviceRepositories.createDevice(device);
    return token;
  }
}
