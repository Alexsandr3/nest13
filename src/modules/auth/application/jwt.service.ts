import { Injectable } from "@nestjs/common";
import jwt from 'jsonwebtoken'
import { settings } from "../../../config/settings";
import { UnauthorizedExceptionMY } from "../../../helpers/My-HttpExceptionFilter";

export class TokensType {
  constructor(public accessToken: string,
              public refreshToken: string) {
  }
}




@Injectable()
export class JwtService {
  constructor() {
  }

  async createJwt(userId: string, login: string, deviceId: string) {
    debugger
    const accessToken = jwt.sign({ userId: userId }, settings.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
    const refreshToken = jwt.sign({
      userId: userId,
      deviceId: deviceId,
      login: login
    }, settings.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });

    return new TokensType(accessToken, refreshToken);
  }

  async verifyToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, settings.REFRESH_TOKEN_SECRET)
      return result
    } catch (error) {
      throw new UnauthorizedExceptionMY(`Unauthorized user`)
    }
  }


  getUserIdByToken(token: string): string {
    try {
      const result: any = jwt.verify(token, settings.ACCESS_TOKEN_SECRET)
      return result.userId
    } catch (error) {
      throw new UnauthorizedExceptionMY(`Unauthorized user`)
    }
  }


}
