import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('CreatePokemonDto', () => {
  it('Should be valid with correct data', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Carlos';
    dto.type = 'Test';
    dto.hp = 5;
    dto.sprites = ['e'];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should be invalid wif name is nor present', async () => {
    const dto = new CreatePokemonDto();

    const errors = await validate(dto);

    const nameError = errors.find((error) => error.property === 'name');

    expect(nameError).toBeDefined();
  });

  it('Should be invalid wif type is nor present', async () => {
    const dto = new CreatePokemonDto();

    const errors = await validate(dto);

    const nameError = errors.find((error) => error.property === 'type');

    expect(nameError).toBeDefined();
  });

  it('Should hp must be positive number', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Carlos';
    dto.type = 'Test';
    dto.hp = -10;

    const errors = await validate(dto);

    const hpEror = errors.find((error) => error.property === 'hp');

    expect(hpEror).toBeDefined();
  });
});
