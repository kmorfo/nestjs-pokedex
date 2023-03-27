import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.valitation';

@Module({
  imports: [
    //Configuración de las variables de entorno utilizando app.config.ts, la validacion se hace a traves de Joi
    ConfigModule.forRoot({
      load:[EnvConfiguration],
      validationSchema:JoiValidationSchema
    }),
    //Servir contenido estatico en la carpeta public
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public'), }),
    //Configuración de mongoose
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
