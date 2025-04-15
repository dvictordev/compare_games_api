import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from '../services/games.service';
import { IFindUniqueGame } from 'src/shared/interfaces/games.interface';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('/search')
  async getGame(@Query() title: IFindUniqueGame) {
    const game = await this.gamesService.getGame(title);

    return game;
  }
}
