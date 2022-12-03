import { Global, Module } from "@nestjs/common";
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from "./mail.service";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";


@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        service: "gmail",
       // host: 'smtp.example.com',
        secure: false,
        auth: {
          user: 'forexperienceinincubatore@gmail.com',
          pass: 'leutohnbwdhbvfvn', //for nest.js
        },
      },
      defaults: {
        from: '"Free help 🔐" <forexperienceinincubatore@gmail.com>', // sender address
      },
      template: {
        //dir: join(__dirname, `templates`),
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {

}
