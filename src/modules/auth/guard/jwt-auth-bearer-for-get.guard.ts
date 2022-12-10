import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "../application/jwt.service";


@Injectable()
export class JwtForGetGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }
  canActivate(context: ExecutionContext): boolean {
    console.log('im un guard: JwtForGetGuard');
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers["authorization"];
    console.log("authorization", authorization);
    if (!authorization) {
      request.userId = null;
      return true
    }
    const token = request.headers.authorization.split(' ')[1]
    const userId = this.jwtService.getUserIdByToken(token);
    if (!userId)  {
      request.userId = null;
      return true
    }
    if(userId) request.userId = userId
    return true;
  }
}

