import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./input-Dto/create-User-Dto-Model";
import { UsersService } from "../domain/users.service";
import { UsersViewType } from "../infrastructure/query-reposirory/user-View-Model";
import { PaginationUsersDto } from "./input-Dto/pagination-Users-Dto-Model";
import { UsersQueryRepositories } from "../infrastructure/query-reposirory/users-query.reposit";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";


@Controller(`users`)
export class UsersController {
  constructor(protected usersService: UsersService,
              protected usersQueryRepositories: UsersQueryRepositories) {
  }

  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UsersViewType> {
    return this.usersService.createUser(userInputModel);
  }

  @Get()
  async findUsers(@Query() pagination: PaginationUsersDto): Promise<PaginationViewModel<UsersViewType[]>> {
    return this.usersQueryRepositories.findUsers(pagination);
  }

  @Delete(`:id`)
  @HttpCode(204)
  async deleteUser(@Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    return await this.usersService.deleteUser(id);
  }

}
