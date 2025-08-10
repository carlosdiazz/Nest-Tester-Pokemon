import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const newPokemon: CreatePokemonDto = { name: 'Prueba', type: 'Prueba 2' };

    const result = await service.create(newPokemon);
    expect(result).toBe(`This action adds a ${newPokemon.name}`);
  });

  it('should return pokemon if exists', async () => {
    const pokemon: Pokemon = {
      name: 'charmander',
      hp: 39,
      id: 4,
      type: 'fire',
      sprites: [],
    };

    const result = await service.findOne(pokemon.id);
    expect(result.name).toBe(pokemon.name);
  });

  it("should return 404 error if pokemon doens't exits", async () => {
    const id = 400_000;
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(
      `Pokemon with id ${id} not found`,
    );
  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });
    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(10);
    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons);
  });

  it('Should check properties of the pokemon', async () => {
    const id = 4;
    const pokemon = await service.findOne(id);

    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toHaveProperty('id');

    expect(pokemon).toEqual(
      expect.objectContaining({
        id,
        hp: expect.any(Number),
      }),
    );
  });
});
