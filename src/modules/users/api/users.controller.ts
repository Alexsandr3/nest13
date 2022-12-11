import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./input-Dto/create-User-Dto-Model";
import { UsersService } from "../domain/users.service";
import { UsersViewType } from "../infrastructure/query-reposirory/user-View-Model";
import { PaginationUsersDto } from "./input-Dto/pagination-Users-Dto-Model";
import { UsersQueryRepositories } from "../infrastructure/query-reposirory/users-query.reposit";
import { PaginationViewModel } from "../../blogs/infrastructure/query-repository/pagination-View-Model";
import { IdValidationPipe } from "../../../helpers/IdValidationPipe";
import { BasicAuthGuard } from "../../../guards/basic-auth.guard";


@Controller(`users`)
export class UsersController {
  constructor(private readonly usersService: UsersService,
              private readonly usersQueryRepositories: UsersQueryRepositories) {
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UsersViewType> {
    return this.usersService.createUser(userInputModel);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUsers(@Query() paginationInputModel: PaginationUsersDto): Promise<PaginationViewModel<UsersViewType[]>> {
    return this.usersQueryRepositories.findUsers(paginationInputModel);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(`:id`)
  async deleteUser(@Param(`id`, IdValidationPipe) id: string): Promise<boolean> {
    return await this.usersService.deleteUser(id);
  }

}
