import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UnauthorizedExceptionMY } from "../../../helpers/My-HttpExceptionFilter";


export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    debugger
    const request = context.switchToHttp().getRequest();
    if(!request.user) throw new UnauthorizedExceptionMY(`UserId didn't come`)
    const userId = request.user
    return  userId
  }
);






