import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UsersViewType } from "../users/infrastructure/user-View-Model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UsersViewType, code: string) {
    const url = `${process.env.CLIENT_URL}/registration-confirmation?code=${code}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      from: '"Free help - 🅱🅻🅰🅲🅺 🅵🆁🅸🅳🅰🆈 🔐" <forexperienceinincubatore@gmail.com>', // sender address
      subject: "Finish registration",
      template: `./confirmation.hbs`, // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.email,
        url,
      },
    }).then((res) => {console.log("Email:response:" , res)})
      .catch((err) => {console.log("Email:error:" , err)});
  }

}
