import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

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

    expect(result).toEqual({
      hp: 0,
      id: expect.any(Number),
      name: 'Prueba',
      sprites: [],
      type: 'Prueba 2',
    });
  });

  it('should throw an error if Pokemon exists', async () => {
    const newPokemon: CreatePokemonDto = { name: 'Prueba', type: 'Prueba 2' };

    await service.create(newPokemon);

    try {
      await service.create(newPokemon);

      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
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

  it('should return a Pokemon from cache', async () => {
    const cacheSpy = jest.spyOn(service.pokemonsCache, 'get');
    const id = 1;

    await service.findOne(id);
    await service.findOne(id);

    expect(cacheSpy).toHaveBeenCalledTimes(1);
  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });
    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(10);
    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons);
  });

  it('should return pokemons from cache', async () => {
    const cacheSpy = jest.spyOn(service.paginatedPokemonsCache, 'get');
    await service.findAll({ limit: 10, page: 1 });

    const fetchSpy = jest.spyOn(global, 'fetch');

    await service.findAll({ limit: 10, page: 1 });
    expect(cacheSpy).toHaveBeenCalledTimes(1);
    expect(cacheSpy).toHaveBeenCalledWith('10-1');
    expect(fetchSpy).toHaveBeenCalledTimes(0);
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

  it('Should update Pokemon', async () => {
    const id = 1;
    const dto: UpdatePokemonDto = { name: 'Prueba 2' };

    const updatedPokemon = await service.update(id, dto);

    expect(updatedPokemon).toEqual({
      hp: 45,
      id: 1,
      name: dto.name,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
      type: 'grass',
    });
  });

  it('Should not update Pokemon if no exists', async () => {
    const id = 1_000_000;
    const dto: UpdatePokemonDto = { name: 'Prueba 2' };

    await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
  });

  it('Should removed Pokemon from Cache', async () => {
    const id = 1;
    await service.findOne(1);

    await service.remove(id);

    expect(service.pokemonsCache.get(id)).toBeUndefined();
  });
});
