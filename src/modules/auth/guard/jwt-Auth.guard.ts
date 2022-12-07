import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "../application/jwt.service";
import { IncomingMessage } from "http";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest<IncomingMessage & { userId?: string }>(context); // you could use FastifyRequest here too
    try {
      const token = this.getToken(request);
      const userId = this.jwtService.getUserIdByToken(token);
      request.userId = userId;
      return true;
    } catch (e) {
      // return false or throw a specific error if desired
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }


  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}
