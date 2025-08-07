import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('POKEMON-MAIN');
  console.log(envs);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Remueve todo lo que no está incluído en los DTOs
      whitelist: true,
      // Retorna bad request si hay propiedades en el objeto no requeridas
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(envs.PORT);
  logger.debug(`👍Server up => PORT => ${envs.PORT} 👍💪👍💪👍💪`);
}

void bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
