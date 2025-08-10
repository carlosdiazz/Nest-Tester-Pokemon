import { Pokemon } from './pokemon.entity';

describe('PokemonEntity', () => {
  it('Should create a Pokemon instance', () => {
    const pokemon = new Pokemon();
    expect(pokemon).toBeInstanceOf(Pokemon);
  });
});
