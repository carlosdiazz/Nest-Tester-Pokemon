import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from '../components/pokemons/pokemons.module';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let appController: AppController;
  let appService: AppService;
  let pokemonsModule: PokemonsModule;

  beforeEach(async () => {
    const moduleRed: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      //controllers: [],
      //providers: [],
    }).compile();

    appController = moduleRed.get<AppController>(AppController);
    appService = moduleRed.get<AppService>(AppService);
    pokemonsModule = moduleRed.get<PokemonsModule>(PokemonsModule);
  });

  it('Should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(pokemonsModule).toBeDefined();
  });
});
