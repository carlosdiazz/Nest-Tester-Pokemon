import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from 'src/components';

@Module({
  imports: [PokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
