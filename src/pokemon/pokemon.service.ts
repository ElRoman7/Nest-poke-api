import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return {
        pokemon,
        message: 'Created',
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async insertMany(createPokemonDto: CreatePokemonDto[]) {
    try {
      const pokemons = await this.pokemonModel.insertMany(createPokemonDto);
      return pokemons;
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    //Si no se especifica en el query params toma valores por defecto
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon = null;
    // Número
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      // Buscar por id usando propiedad de Mongo
      pokemon = await this.pokemonModel.findById(term);
    }
    //Si no se encuentra, bucar por nombre
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term });
    // No se encontró
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(_id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({ _id });
    if (result.deletedCount === 0)
      throw new BadRequestException(`Pokemon with ${_id} not found`);

    return;
  }

  async removeAll(areYouSure: boolean = false): Promise<string> {
    if (areYouSure) {
      await this.pokemonModel.deleteMany({}); //delete * from pokemons
      return 'Table is clean';
    }
    throw new BadRequestException(
      'If you want to use this function, you need to confirm the variable "areYouSure"',
    );
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
