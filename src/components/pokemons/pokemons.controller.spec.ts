import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
  {
    id: 3,
    name: 'venusaur',
    type: 'grass',
    hp: 80,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should hace called the service with correct parameter', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    jest.spyOn(service, 'findAll');

    await controller.findAll(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should hace called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons));

    const pokemons = await controller.findAll(dto);

    expect(pokemons).toBe(mockPokemons);
  });

  it('should have called the service with the correct id (findOne)', async () => {
    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));
    const id = '1';

    const pokemon = await controller.findOne(id);

    expect(spy).toHaveBeenCalledWith(+id);
    expect(pokemon).toEqual(mockPokemons[0]);
  });

  it('should have called the service with the correct id and data (update)', async () => {
    jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    const id = '1';

    const dto: UpdatePokemonDto = {
      name: 'Bulbasaur Diaz',
    };

    await controller.update(id, dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalledWith(+id, dto);
  });

  it('should have called the service with the correct id (delete)', async () => {
    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve('Pokemon remove'));

    const id = '1';

    const result = await controller.remove(id);

    expect(result).toBe('Pokemon remove');
  });

  it('Shopuld call create service method', async () => {
    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    const result = await controller.create({ name: 'Crear', type: 'Typo' });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenCalledWith({
      name: 'Crear',
      type: 'Typo',
    });
    expect(result).toBe(mockPokemons[0]);
  });
});
