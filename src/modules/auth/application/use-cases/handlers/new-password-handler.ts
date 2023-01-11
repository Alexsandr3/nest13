import { BadRequestExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NewPasswordCommand } from "../new-password-command";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { UsersService } from "../../../../users/domain/users.service";

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly usersRepositories: UsersRepositories,
    private readonly usersService: UsersService
  ) {
  }

  async execute(command: NewPasswordCommand): Promise<boolean> {
    const { newPassword, recoveryCode } = command.newPasswordInputModel;
    //search user by code
    const user = await this.usersRepositories.findUserByRecoveryCode(
      recoveryCode
    );
    if (!user)
      throw new BadRequestExceptionMY({
        message: `Incorrect input data`,
        field: "code"
      });
    //check code confirmation
    if (user.checkingConfirmCode(recoveryCode)) {
      //generation new passwordHash for save
      const passwordHash = await this.usersService.generateHash(newPassword);
      //update password
      user.updatePassword(passwordHash);
      //saved updated password
      await this.usersRepositories.saveUser(user);
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Code has confirmation already`,
      field: "code"
    });
  }
}
