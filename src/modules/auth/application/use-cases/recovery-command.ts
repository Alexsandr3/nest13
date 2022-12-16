import { EmailRecoveryDto } from '../../api/dto/email-Recovery-Dto-Model';

export class RecoveryCommand {
  constructor(public readonly emailInputModel: EmailRecoveryDto) {}
}
