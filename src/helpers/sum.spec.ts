import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  it('should sum two numbers', () => {
    //Arrange (Preparar)
    const num_1 = 10;
    const nume_2 = 20;

    //ACR (Actuar)
    const result = sum(num_1, nume_2);

    //ASSERT (Verificar / Afirmar)
    expect(result).toBe(30);
  });
});
