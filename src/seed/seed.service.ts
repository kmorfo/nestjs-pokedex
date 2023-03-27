import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {



  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) { }


  async executeSeed() {
    //Borramos todos los datos de la bd para inicializarla
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    //2 Una opción para realizar multiples inyecciones en la bd es crear un array de pomesas
    //const insertPromisesArray = [];
    const pokemonToInsert: { name: string, no: number }[] = [];

    //Recorremos los resultados para extraer en no. del pokemon ya que viene en la url
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      //1 Inserta tan solo un registro a la vez
      // await this.pokemonModel.create({name,no})

      //2 Se añade la promesa al array
      //insertPromisesArray.push(this.pokemonModel.create({ name, no }));
      pokemonToInsert.push({ name, no });
    });

    //2 resolvemos el array de promesas de una vez
    //await Promise.all(insertPromisesArray);

    //Se realizan todas las inserciones de una vez en la BD
    this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed!!!';
  }

}
