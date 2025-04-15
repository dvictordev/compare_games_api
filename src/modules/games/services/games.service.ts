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
        include: {
          platforms: {
            include: {
              platform: true,
            },
          },
        },
      });

      if (game.length === 0) {
        const apiGame: Games[] = await this.api.getGame({ title });

        if (!apiGame || apiGame.length === 0) {
          throw new Error('Game not found');
        }

        for (const game of apiGame) {
          const platforms = game.platforms.map((p) => ({
            where: { slug: p.platform.slug },
            create: {
              name: p.platform.name,
              slug: p.platform.slug,
            },
          }));

          await this.prisma.game.create({
            data: {
              title: game.name,
              description: game.slug,
              releaseDate: game.released,
              rating: game.rating,
              coverImage: game.background_image,
              platforms: {
                create: platforms.map((platform) => ({
                  platform: {
                    connectOrCreate: platform,
                  },
                })),
              },
            },
          });
        }

        const games = await this.prisma.game.findMany({
          where: {
            title: {
              contains: title,
              mode: 'insensitive',
            },
          },
          include: {
            platforms: {
              include: {
                platform: true,
              },
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
        some: {
          platform: {
            name: {
              contains: platform,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    const games = await this.prisma.game.findMany({
      where,
      include: {
        platforms: {
          include: {
            platform: true,
          },
        },
      },
    });

    return games;
  }
}
