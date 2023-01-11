import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserSaCommand } from "../create-user-sa-command";
import { UsersService } from "../../../domain/users.service";
import { BadRequestExceptionMY } from "../../../../../helpers/My-HttpExceptionFilter";
import { CreateUserDto } from "../../../api/input-Dto/create-User-Dto-Model";
import { UsersRepositories } from "../../../infrastructure/users-repositories";
import { UsersQueryRepositories } from "../../../infrastructure/query-reposirory/users-query.reposit";
import { UsersViewType } from "../../../infrastructure/query-reposirory/user-View-Model";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../../domain/users-schema-Model";
import { Model } from "mongoose";


@CommandHandler(CreateUserSaCommand)
export class CreateUserSaHandler implements ICommandHandler<CreateUserSaCommand> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersRepositories: UsersRepositories,
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private readonly usersService: UsersService
  ) {
  }

  async execute(command: CreateUserSaCommand): Promise<UsersViewType> {
    const { email, login, password } = command.userInputModel;
    //email verification and login for uniqueness
    await this.validateUser(command.userInputModel);
    //generation Hash
    const passwordHash = await this.usersService.generateHash(password);
    // preparation data User for DB
    const newUser = User.createUser(login, email, passwordHash, true);
    //create instance
    const createdUser = new this.userModel(newUser);
    //saving created instance user
    const userId = await this.usersRepositories.saveUser(createdUser);
    //finding user for View
    return await this.usersQueryRepositories.findUser(userId);
  }

  private async validateUser(userInputModel: CreateUserDto): Promise<boolean> {
    const { login, email } = userInputModel;
    //finding user
    const checkLogin = await this.usersRepositories.findByLoginOrEmail(login);
    if (checkLogin)
      throw new BadRequestExceptionMY({
        message: `Login or Email already in use, do you need choose new data`,
        field: `login`
      });
    const checkEmail = await this.usersRepositories.findByLoginOrEmail(email);
    if (checkEmail)
      throw new BadRequestExceptionMY({
        message: `Login or Email already in use, do you need choose new data`,
        field: `email`
      });
    return true;
  }
}

/*

const user = new PreparationUserForDB(
  {
    login,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  },
  {
    confirmationCode: randomUUID(),
    expirationDate: add(new Date(), { hours: 1 }),
    isConfirmation: true
  },
  {
    recoveryCode: randomUUID(),
    expirationDate: add(new Date(), { hours: 1 }),
    isConfirmation: false
  },
  {
    isBanned: false,
    banDate: null,
    banReason: null
  }
);*/
