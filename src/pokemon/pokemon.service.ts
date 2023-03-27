import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';


@Injectable()
export class PokemonService {
  private defaultLimit:number;
  //Se configura la inyección de depencencias, asociando el modelo y la entidad creada
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService :ConfigService
  ) { 
    this.defaultLimit=configService.get<number>('default_limit');    
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      //Guarda el nuevo pokemon en la BD
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDTO: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDTO;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');//Quitamos ese campo
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //Si el valor es un numero se busca por no
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    //MongoID
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);

    //Name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });

    //Si no existe aun retornamos la excepcion not found
    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //Utilizamos el metodo findOne para obtener el pokemon, ya sera por id, no o nombre
    const pokemon = await this.findOne(term);

    //Si viene el nombre se pasa a minusculas
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    //Controlamos la excepción de clave unica duplicada
    try {
      //Actualizamos el pokemon
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //Este código sería valido para eliminar el pokemon con no, id o nombre recibiendo un string con cualquiera de las dos cosas
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id); //Borra uno pero no confirma si se borro
    const { deletedCount } = await this.pokemonModel.deleteMany({ _id: id });//delete from pokemon
    //Devuelve el num de borrados
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} not found`);

    return;
  }

  private handleExceptions(error: any) {
    //11000 registro duplicado a llave unica
    if (error.code === 11000)
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);

    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
