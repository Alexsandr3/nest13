import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    debugger
    const request = context.switchToHttp().getRequest();
    if(!request.userId)  request.userId = null    //throw new UnauthorizedExceptionMY(`UserId didn't come`)
    const userId = request.userId
    return  userId
  }
);






