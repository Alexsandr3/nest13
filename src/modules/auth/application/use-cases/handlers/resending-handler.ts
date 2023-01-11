import { BadRequestExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResendingCommand } from "../resending-command";
import { HttpException } from "@nestjs/common";
import { UsersRepositories } from "../../../../users/infrastructure/users-repositories";
import { MailService } from "../../../../mail/mail.service";

@CommandHandler(ResendingCommand)
export class ResendingHandler implements ICommandHandler<ResendingCommand> {
  constructor(private readonly usersRepositories: UsersRepositories,
              private readonly mailService: MailService
  ) {
  }

  async execute(command: ResendingCommand): Promise<boolean> {
    const { email } = command.resendingInputModel;
    //search user by email
    const user = await this.usersRepositories.findByLoginOrEmail(email);
    if (!user)
      throw new BadRequestExceptionMY({
        message: `Incorrect input data`,
        field: "email"
      });
    //check code
    if (user.checkingEmail()) {
      //generation a new code
      user.updateConfirmCode();
      //save updated code confirmation
      await this.usersRepositories.saveUser(user);
      try {
        //sending code to email
        await this.mailService.sendEmailRecoveryMessage(
          user.accountData.email,
          user.emailConfirmation.confirmationCode
        );
      } catch (error) {
        console.error(error);
        throw new HttpException(
          "Service is unavailable. Please try again later. We need saved User",
          421
        );
      }
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Confirmation has expired`,
      field: "email"
    });
  }
}
