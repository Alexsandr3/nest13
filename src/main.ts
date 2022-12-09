import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ErrorExceptionFilter, HttpExceptionFilter } from "./exception.filter";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5003;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { credentials: true } });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //data from input DTO
    forbidNonWhitelisted: true, //stopping create data
    transform: true, //transform data to correct
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const errorsForRes = [];
      errors.forEach((e) => {
        // errorsForRes.push({field: e.property})
        const constrainKeys = Object.keys(e.constraints);
        constrainKeys.forEach((ckey) => {
          errorsForRes.push({ message: e.constraints[ckey], field: e.property });
        });

      });
      throw new BadRequestException(errorsForRes);
    }
  }));
  app.enableCors({});
  app.use(cookieParser());
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  await app.listen(PORT).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
}

bootstrap();
