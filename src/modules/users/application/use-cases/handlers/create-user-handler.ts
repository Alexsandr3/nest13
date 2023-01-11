import { HttpException } from "@nestjs/common";
import { CreateUserDto } from "../../../api/input-Dto/create-User-Dto-Model";
import { UsersRepositories } from "../../../infrastructure/users-repositories";
import { UsersQueryRepositories } from "../../../infrastructure/query-reposirory/users-query.reposit";
import { UsersViewType } from "../../../infrastructure/query-reposirory/user-View-Model";
import { MailService } from "../../../../mail/mail.service";
import { BadRequestExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../create-user-command";
import { UsersService } from "../../../domain/users.service";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument, User } from "../../../domain/users-schema-Model";
import { Model } from "mongoose";


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersRepositories: UsersRepositories,
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {
  }

  async execute(command: CreateUserCommand): Promise<UsersViewType> {
    const { email, login, password } = command.userInputModel;
    //email verification and login for uniqueness
    await this.validateUser(command.userInputModel);
    //generation Hash
    const passwordHash = await this.usersService.generateHash(password);
    // preparation data User for DB
    const user = User.createUser(login, email, passwordHash, false);
    //create instance
    const createdUser = new this.userModel(user);
    //saving created instance user
    const userId = await this.usersRepositories.saveUser(createdUser);
    //finding user for View
    const viewUser = await this.usersQueryRepositories.findUser(userId);
    try {
      //send mail for confirmation
      await this.mailService.sendUserConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode
      );
    } catch (error) {
      console.error(error);
      //if not saved user - him need remove ??
      //await this.usersRepositories.deleteUser(userId);
      throw new HttpException(
        "Service is unavailable. Please try again later. We need saved User",
        421
      );
    }
    return viewUser;
  }

  private async validateUser(userInputModel: CreateUserDto): Promise<boolean> {
    const { login, email } = userInputModel;
    //find user
    const checkEmail = await this.usersRepositories.findByLoginOrEmail(email);
    if (checkEmail)
      throw new BadRequestExceptionMY({
        message: `${email}  already in use, do you need choose new data`,
        field: `email`
      });``
    const checkLogin = await this.usersRepositories.findByLoginOrEmail(login);
    if (checkLogin)
      throw new BadRequestExceptionMY({
        message: `${login}  already in use, do you need choose new data`,
        field: `login`
      });
    return true;
  }
}
