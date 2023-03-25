import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    //Servir contenido estatico en la carpeta public
    ServeStaticModule.forRoot({ rootPath: join(__dirname,'..','public'),}),
    //Configuración de mongoose
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    PokemonModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }