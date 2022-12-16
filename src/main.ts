import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorExceptionFilter, HttpExceptionFilter, } from './filters/exception.filter';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config/configuration";



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true },
  });
  const configService = app.get(ConfigService<ConfigType>)
  const port = configService.get('PORT', {infer: true})
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, //data from input DTO
      //forbidNonWhitelisted: true, //stopping create data
      transform: true, //transform data to correct
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const errorsForRes = [];
        errors.forEach((e) => {
          // errorsForRes.push({field: e.property})
          const constrainKeys = Object.keys(e.constraints);
          constrainKeys.forEach((ckey) => {
            errorsForRes.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForRes);
      },
    }));
  app.enableCors({});
  app.use(cookieParser());
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
}

bootstrap();
