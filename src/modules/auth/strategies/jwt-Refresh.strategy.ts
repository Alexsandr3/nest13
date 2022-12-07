import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "../application/jwt.service";
import { settings } from "../../../config/settings";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor(
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {return request?.cookies.refreshToken}]),
      secretOrKey: settings.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true
    });
  }

  async validate(request: Request): Promise<string> {
    const refreshToken = request.cookies.refreshToken;
    const payload = await this.jwtService.verifyToken(refreshToken);
    return payload
  }
}




/*export const checkRefreshTokena = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send("Did not come refreshToken")
  const payload = await jwtService.verifyToken(refreshToken)

  const dateExp = new Date(payload.exp * 1000)
  if (dateExp < new Date()) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Expired date')

  const deviceUser = await deviceRepositories.findDeviceForValid(payload.userId, payload.deviceId, payload.iat)
  if (!deviceUser) return res.status(HTTP_STATUSES.UNAUTHORIZED_401).send('Incorrect userId or deviceId or issuedAt')
  req.payload = payload
  next()
}*/
