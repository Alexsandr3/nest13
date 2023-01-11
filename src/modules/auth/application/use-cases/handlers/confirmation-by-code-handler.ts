import { BadRequestExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { ConfirmByCodeCommand } from "../confirmation-by-code-command";

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeHandler
  implements ICommandHandler<ConfirmByCodeCommand> {
  constructor(
    private readonly usersRepositories: UsersRepositories
  ) {
  }

  async execute(command: ConfirmByCodeCommand): Promise<boolean> {
    const { code } = command.codeInputModel;
    //finding user by code
    const user = await this.usersRepositories.findUserByConfirmationCode(code);
    if (!user)
      throw new BadRequestExceptionMY({
        message: `Invalid code, user already registered`,
        field: "code"
      });
    if (user.checkingConfirmCode(code)) {
      //update status code-> true
      user.updateStatusConfirmCode();
      await this.usersRepositories.saveUser(user);
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Code has confirmation already`,
      field: "code"
    });
  }
}
