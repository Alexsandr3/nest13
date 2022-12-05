import { NotFoundException } from "@nestjs/common";


//model for 404 - `Not Found` error
export class NotFoundExceptionMY {
  constructor(message) {
    throw new NotFoundException(message);
  }
}

