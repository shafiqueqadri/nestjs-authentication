import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {env} from 'process'
import { config as dotEnvConfig } from "dotenv";
const path = require('path');
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationFormatter } from './helpers/validation-formatter.helper';
//dotEnvConfig();
require('dotenv').config({ path: path.join(__dirname, '..','.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: any) => new UnprocessableEntityException(ValidationFormatter(errors))
    })
  );
  app.enableCors();
  await app.listen(env.PORT || 3000);
}
bootstrap();
