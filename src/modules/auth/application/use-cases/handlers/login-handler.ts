import { UnauthorizedExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeviceRepositories } from "../../../../security/infrastructure/device-repositories";
import { LoginCommand } from "../login-command";
import { JwtService, TokensType } from "../../jwt.service";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { randomUUID } from "crypto";
import { Device, DeviceDocument } from "../../../../security/domain/device-schema-Model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
    private readonly jwtService: JwtService,
    private readonly deviceRepositories: DeviceRepositories,
    private readonly usersRepositories: UsersRepositories
  ) {
  }


  async execute(command: LoginCommand): Promise<TokensType> {
    const { password, loginOrEmail } = command.loginInputModel;
    const ipAddress = command.ip;
    const deviceName = command.deviceName;
    //validate user by login or email
    const user = await this.usersRepositories.findByLoginOrEmail(loginOrEmail);
    if (!user) throw new UnauthorizedExceptionMY(`User '${loginOrEmail}' is not authorized `);
    //check passwordHash
    if (await user.comparePassword(password)) {
      if (user.checkStatusBan()) {
        //deleting a devices-sessions if the user is banned
        await this.deviceRepositories.deleteDevicesForBannedUser(user.id);
        throw new UnauthorizedExceptionMY(`Did you get a ban!`);
      }
      //preparation data for token
      const deviceId = randomUUID();
      const userId = user.id;
      //generation of a new pair of tokens
      const token = await this.jwtService.createJwt(userId, deviceId);
      const payloadNew = await this.jwtService.verifyRefreshToken(token.refreshToken);
      //preparation data for save device
      const dateCreatedToken = new Date(payloadNew.iat * 1000).toISOString();
      const dateExpiredToken = new Date(payloadNew.exp * 1000).toISOString();
      const newDevice = Device.createDevice(userId, ipAddress, deviceName, dateCreatedToken, dateExpiredToken, deviceId);
      //create instance
      const device = new this.deviceModel(newDevice);
      await this.deviceRepositories.saveDevice(device);
      return token;
    }
    throw new UnauthorizedExceptionMY(`Incorrect password --sa-`);
  }
}
