import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  //Especificamos la entidad con la que trabajara el modulo
  imports:[
    MongooseModule.forFeature([{
      name:Pokemon.name,
      schema:PokemonSchema
    }]),
  ]
})
export class PokemonModule {}
