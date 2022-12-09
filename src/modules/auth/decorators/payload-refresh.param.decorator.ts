import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { settings } from "../../../config/settings";

export const PayloadRefresh = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return verify(request.cookies.refreshToken, settings.REFRESH_TOKEN_SECRET);
  }
);
