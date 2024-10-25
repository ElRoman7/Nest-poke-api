import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Extender de document da todos los métodos
@Schema()
export class Pokemon {
  // Mongo genera el string
  // Se usa el decorador Prop para las propiedades
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
