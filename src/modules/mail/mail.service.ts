import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, code: string) {
    const url = `${process.env.CLIENT_URL}/registration-confirmation?code=${code}`;
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      from: '"🅱🅻🅰🅲🅺 🅵🆁🅸🅳🅰🆈 🔐" <forexperienceinincubatore@gmail.com>', // sender address
      subject: "Finish registration",
      template: `./confirmation.hbs`, // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    }).then((res) => {console.log("Email:response:" , res)})
      .catch((err) => {console.log("Email:error:" , err)});
  }

  async sendPasswordRecoveryMessage(email, code: string) {
    const url = `${process.env.CLIENT_URL}/new-password?code=${code}`;
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      from: '"🅱🅻🅰🅲🅺 🅵🆁🅸🅳🅰🆈 🔐" <forexperienceinincubatore@gmail.com>', // sender address
      subject: "Password recovery",
      template: `./recovery.hbs`, // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    }).then((res) => {console.log("Email:response:" , res)})
      .catch((err) => {console.log("Email:error:" , err)});
  }

  async sendEmailRecoveryMessage(email, code: string) {
    const url = `${process.env.CLIENT_URL}/registration-confirmation?code=${code}`;
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      from: '"🅱🅻🅰🅲🅺 🅵🆁🅸🅳🅰🆈 🔐" <forexperienceinincubatore@gmail.com>', // sender address
      subject: "Finish password recovery",
      template: `./recovery.hbs`, // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    }).then((res) => {console.log("Email:response:" , res)})
      .catch((err) => {console.log("Email:error:" , err)});
  }
}
