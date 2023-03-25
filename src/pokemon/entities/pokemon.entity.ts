import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Nota: la entidad extiende de Document de mongoose con el decorador Schema @nestjs/mongoose
@Schema()
export class Pokemon extends Document {
    // id:string; // Es autogenerado por mongo
    //Dentro del decorador @Prop se indican las propiedades de cada una de los atributos 
    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);