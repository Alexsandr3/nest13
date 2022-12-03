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
          pass: 'nbhygxjlzivnxxjh',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        //dir: join(__dirname, 'templates'),
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
