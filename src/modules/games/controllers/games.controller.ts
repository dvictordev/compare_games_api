import { Body, Controller, Get, Query } from '@nestjs/common';
import { GamesService } from '../services/games.service';
import {
  IFindAllGames,
  IFindUniqueGame,
} from 'src/shared/interfaces/games.interface';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('/search')
  @ApiOperation({
    summary: 'Get a game by title',
    description: 'Search for a game by its title',
  })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully found',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @ApiQuery({
    name: 'title',
    type: String,
    description: 'The title of the game to search for',
    required: true,
  })
  async getGame(@Query() title: IFindUniqueGame) {
    const game = await this.gamesService.getGame(title);

    return game;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all games',
    description: 'Retrieve a list of all games',
  })
  @ApiResponse({
    status: 200,
    description: 'The games have been successfully retrieved',
  })
  @ApiBody({
    type: IFindAllGames,
    description: 'Filter options for retrieving games',
  })
  async getAllGames(@Body() data: IFindAllGames) {
    const games = await this.gamesService.getAllGames(data);

    return games;
  }
}
