import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Introducimos los pipes que queremos que se apliquen de forma global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,//Borra los atributos que no esten especificados en el DTO
      forbidNonWhitelisted: true, //Indica en la respuesta los parametros no deseados que nos mando el cliente
      //Habilitando transform podremos obtener los tipos de parametros enviados en el formato enviado, no todos como strings
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  //Aplicamos una configuración global para el prefix de todas las peticiones
  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
