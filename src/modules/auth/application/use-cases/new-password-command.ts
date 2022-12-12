import { NewPasswordDto } from "../../api/dto/new-Password-Dto-Model";


export class NewPasswordCommand {
  constructor(public readonly newPasswordInputModel: NewPasswordDto) {
  }

}