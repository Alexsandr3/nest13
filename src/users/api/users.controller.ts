import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./input-Dto/create-User-Dto-Model";
import { UsersService } from "../domain/users.service";
import { UsersViewType } from "../infrastructure/user-View-Model";


@Controller(`users`)
export class UsersController {
  constructor(protected usersService: UsersService) {
  }

  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UsersViewType | null> {
    return this.usersService.createUser(userInputModel);
  }

}
