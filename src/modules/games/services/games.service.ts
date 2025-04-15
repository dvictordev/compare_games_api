import { Injectable } from '@nestjs/common';
import {
  IFindAllGames,
  IFindUniqueGame,
} from 'src/shared/interfaces/games.interface';

import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getGame({ title }: IFindUniqueGame) {
    const game = await this.prisma.game.findFirst({
      where: {
        title,
      },
    });

    //  XXX TODO: Implementar integracao com API RAWG

    return game;
  }

  async getAllGames({ platform, title }: IFindAllGames = {}) {
    const games = await this.prisma.game.findMany({
      where: {
        title: {
          contains: title ? title : undefined,
          mode: 'insensitive',
        },
        platforms: {
          some: {
            id: platform ? platform : undefined,
          },
        },
      },
    });

    //  XXX TODO: Implementar integracao com API RAWG

    return games;
  }
}
