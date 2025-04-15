import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import {
  IFindAllGames,
  IFindUniqueGame,
} from 'src/shared/interfaces/games.interface';
import { Api } from 'src/shared/services/api.client';

import { PrismaService } from 'src/shared/services/prisma.service';

interface Games {
  slug: string;
  name: string;
  platforms: [
    {
      platform: {
        id: number;
        name: string;
        slug: string;
      };
    },
  ];
  released: string;
  rating: number;
  background_image: string;
}
@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private api: Api,
  ) {}

  async getGame({ title }: IFindUniqueGame) {
    try {
      const game = await this.prisma.game.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
      });

      if (game.length === 0) {
        const apiGame: Games[] = await this.api.getGame({ title });

        if (!apiGame || apiGame.length === 0) {
          throw new Error('Game not found');
        }

        const formatedGamesToDatabase = apiGame.map((game) => {
          return {
            title: game.name,
            description: game.slug,
            platforms: game.platforms.map((platform) => platform.platform.id),
            releaseDate: game.released,
            rating: game.rating,
            coverImage: game.background_image,
          };
        });

        await this.prisma.game.createMany({
          data: formatedGamesToDatabase,
        });

        const games = await this.prisma.game.findMany({
          where: {
            title: {
              contains: title,
              mode: 'insensitive',
            },
          },
        });
        return games;
      }
      return game;
    } catch (error) {
      throw error;
    }
  }

  async getAllGames({ platform, title }: IFindAllGames = {}) {
    const where: Prisma.GameWhereInput = {};

    if (title) {
      where.title = {
        equals: title,
        mode: 'insensitive',
      };
    }

    if (platform) {
      where.platforms = {
        has: platform,
      };
    }
    const games = await this.prisma.game.findMany({
      where,
    });

    return games;
  }
}
