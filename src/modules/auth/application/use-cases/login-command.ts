import { LoginDto } from '../../api/dto/login-Dto-Model';

export class LoginCommand {
  constructor(
    public readonly loginInputModel: LoginDto,
    public readonly ip: string,
    public readonly deviceName: string,
  ) {}
}
