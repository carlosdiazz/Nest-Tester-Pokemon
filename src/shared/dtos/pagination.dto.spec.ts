import 'reflect-metadata';

import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { plainToInstance } from 'class-transformer';

describe('PaginationDto', () => {
  it('should validate with default vlaue', async () => {
    const dto = new PaginationDto();
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate with valid data', async () => {
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.page = 2;
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate with invalid page', async () => {
    const dto = new PaginationDto();
    dto.page = -4;
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it('should not validate with invalid limit', async () => {
    const dto = new PaginationDto();
    dto.limit = -23;
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it('should convert strings to number', async () => {
    const input = { limit: '10', page: '2' };

    //Plain To Instance se usa para validar en ClassTransforme
    const dto = plainToInstance(PaginationDto, input);

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.limit).toBe(10);
    expect(dto.page).toBe(2);
  });
});
