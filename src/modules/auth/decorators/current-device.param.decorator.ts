import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const CurrentDevice = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if(!request.payload) throw new Error(`not today`)
    return request.payload.userId
  }
);