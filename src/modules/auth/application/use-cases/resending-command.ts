import { EmailRecoveryDto } from '../../api/dto/email-Recovery-Dto-Model';

export class ResendingCommand {
  constructor(public readonly resendingInputModel: EmailRecoveryDto) {}
}
