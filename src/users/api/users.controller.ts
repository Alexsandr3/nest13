import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./input-Dto/create-User-Dto-Model";
import { UsersService } from "../domain/users.service";
import { UsersViewType } from "../infrastructure/user-View-Model";
import { PaginationUsersDto } from "./input-Dto/pagination-Users-Dto-Model";
import { UsersQueryRepositories } from "../infrastructure/users-query.reposit";
import { PaginationViewType } from "../../blogs/infrastructure/pagination-type";


@Controller(`users`)
export class UsersController {
  constructor(protected usersService: UsersService,
              protected usersQueryRepositories: UsersQueryRepositories) {
  }

  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UsersViewType | null> {
    return this.usersService.createUser(userInputModel);
  }

  @Get()
  async findUsers(@Query() pagination: PaginationUsersDto): Promise<PaginationViewType<UsersViewType[]>> {
    return this.usersQueryRepositories.findUsers(pagination);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<boolean> {
    return await this.usersService.deleteUser(id);
  }

}
