import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app/app.module';
import { Pokemon } from 'src/components/pokemons/entities/pokemon.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/pokemons (POST) - with no body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    const messageArray: string[] = response.body.message ?? [];

    expect(response.statusCode).toBe(400);
    expect(messageArray).toContain('name must be a string');
    expect(messageArray).toContain('name should not be empty');
    expect(messageArray).toContain('type must be a string');
    expect(messageArray).toContain('type should not be empty');
  });

  it('/pokemons (POST) - with no body 2 ', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    const errorMessage = [
      'name must be a string',
      'name should not be empty',
      'type must be a string',
      'type should not be empty',
    ];

    const messageArray: string[] = response.body.message ?? [];

    expect(messageArray.length).toBe(errorMessage.length);
    expect(messageArray).toEqual(expect.arrayContaining(errorMessage));
  });

  it('/pokemons (POST) - with valid body', async () => {
    const response = await request(app.getHttpServer())
      .post('/pokemons')
      .send({ name: 'Test', type: 'Test' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      name: 'Test',
      type: 'Test',
      hp: 0,
      sprites: [],
      id: expect.any(Number),
    });
  });

  it('/pokemons (GET) should return pagianted list of pokemons', async () => {
    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query({ limit: 5, page: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('sprites');
    });
  });

  it('/pokemons/:id (GET) Should return a Pokemon by ID', async () => {
    const response = await request(app.getHttpServer()).get('/pokemons/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('/pokemons/:id (GET) Should return Not found', async () => {
    const response = await request(app.getHttpServer()).get('/pokemons/199999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('/pokemons/:id (PATCH) should update Pokemon', async () => {
    const response = await request(app.getHttpServer())
      .patch('/pokemons/1')
      .send({ name: 'je' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('/pokemons/:id (PATCH) should throw an 404', async () => {
    const response = await request(app.getHttpServer())
      .patch('/pokemons/4000000')
      .send({ name: 'je' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('/pokemons/:id (DELETE) should remove Pokemon', async () => {
    const response = await request(app.getHttpServer()).delete('/pokemons/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('/pokemons/:id (DELETE) should throw an 404', async () => {
    const response = await request(app.getHttpServer()).delete(
      '/pokemons/4000000',
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
  });
});
