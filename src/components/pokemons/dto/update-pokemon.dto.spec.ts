import { validate } from 'class-validator';
import { UpdatePokemonDto } from './update-pokemon.dto';

describe('UpdatePokemonDto', () => {
  it('Should be valid with correct data', async () => {
    const dto = new UpdatePokemonDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('Should hp must be positive number', async () => {
    const dto = new UpdatePokemonDto();
    dto.hp = -10;

    const errors = await validate(dto);

    const hpEror = errors.find((error) => error.property === 'hp');

    expect(hpEror).toBeDefined();
  });
});
