import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './services/games.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Api } from 'src/shared/services/api.client';

@Module({
  imports: [],
  controllers: [GamesController],
  providers: [GamesService, PrismaService, Api],
})
export class GamesModule {}
