import { Injectable } from '@nestjs/common';
import { IFindUniqueGame } from 'src/shared/interfaces/games.interface';

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
}
