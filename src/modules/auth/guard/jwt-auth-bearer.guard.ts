import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "../application/jwt.service";
import { UnauthorizedExceptionMY } from "../../../helpers/My-HttpExceptionFilter";
import { request } from "express";



@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }
  // @ts-ignore
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(req);
      const userId = this.jwtService.getUserIdByToken(token);
      if (!userId) throw new UnauthorizedExceptionMY(`Did not come userId`);
      return  request.user = userId
    } catch (e) {
      // return false or throw a specific error if desired
      throw new Error(e)
    }
  }


  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers["authorization"];
    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedExceptionMY("Did not come accessToken");
    }
    const [_, token] = authorization.split(" ");// const token = req.headers.authorization.split(' ')[1]
    return token;
  }
}
