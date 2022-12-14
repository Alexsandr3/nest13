import { UsersRepositories } from "../../../infrastructure/users-repositories";
import { NotFoundExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../delete-user-command";


@CommandHandler(DeleteUserCommand)
export class CreateUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepositories: UsersRepositories) {
  }


  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { id } = command;
    const result = await this.usersRepositories.deleteUser(id);
    await this.usersRepositories.deleteUserBanInfo(id)
    if (!result) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    }
    return true;
  }
}


