import { NestFactory } from '@nestjs/core';
import { bootstrap } from './main';
import { AppModule } from './app';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe('Main.ts Bootstrap', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock;
    setGlobalPrefix: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('Should create application', async () => {
    await bootstrap();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('Should set global prefix', async () => {
    await bootstrap();
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('Should listen on env port', async () => {
    process.env.PORT = '4200';

    await bootstrap();
    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT);
  });

  it('Should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        validatorOptions: expect.objectContaining({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      }),
    );
  });
});
