import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { settings } from "../../../config/settings";
import { UnauthorizedExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { PayloadType } from "./payloadType";


export class TokensType {
  constructor(public accessToken: string,
              public refreshToken: string) {
  }
}


@Injectable()
export class JwtService {
  constructor() {
  }

  async createJwt(userId: string, deviceId: string): Promise<TokensType> {
    const accessToken = jwt.sign({
      userId: userId }, settings.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
    const refreshToken = jwt.sign({
      userId: userId, deviceId: deviceId }, settings.REFRESH_TOKEN_SECRET, { expiresIn: "15m" });
    return new TokensType(accessToken, refreshToken);
  }

  async verifyRefreshToken(refreshToken: string): Promise<PayloadType> {
    try {
      const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET);
      return result;
    } catch (error) {
      throw new UnauthorizedExceptionMY(`Unauthorized user`);
    }
  }

  async getUserIdByToken(token: string): Promise<string> {
    try {
      const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET);
      return result.userId;
    } catch (error) {
      return null;
      //throw new UnauthorizedExceptionMY(`Unauthorized user`);
    }
  }

}
