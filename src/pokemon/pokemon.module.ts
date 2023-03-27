import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { PokemonService } from './pokemon.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  //Especificamos la entidad con la que trabajara el modulo
  imports:[
    ConfigModule,
    MongooseModule.forFeature([{
      name:Pokemon.name,
      schema:PokemonSchema
    }]),
  ],
  exports:[MongooseModule]
})
export class PokemonModule {}
