import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import cookieParser from 'cookie-parser'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //za class-validation (whitelist=odstrani var ki niso pricakovani v definiranem dto)
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  
  //app.use(cookieParser()) //cookies visible na client side
  
  //Setup to display files (shranjevanje slik v root)
  app.use('/files', express.static('files'))

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)
}
bootstrap();
