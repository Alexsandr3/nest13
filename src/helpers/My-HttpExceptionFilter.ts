import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";


//model for 404 - `Not Found` error
export class NotFoundExceptionMY {
  constructor(message) {
    throw new NotFoundException(message);
  }
}


//model for 400 - `BAD_REQUEST` error
export class BadRequestExceptionMY {
  constructor(message) {
    console.log("xxx - message" , message);
    throw new BadRequestException(message);
  }
}

//model for 401 - `Unauthorized` error
export class UnauthorizedExceptionMY {
  constructor(message) {
    throw new UnauthorizedException(message);
  }
}