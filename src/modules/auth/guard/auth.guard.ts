import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";


@Injectable()
export class DeviceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
   // request.ip, request.headers["user-agent"];
    return
  }
}