import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from 'src/modules/games/services/games.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Api } from 'src/shared/services/api.client';
import { Cache } from 'cache-manager';
import { mockPrismaService, mockCacheManager, mockApi } from './utils/_mocks';

describe('GamesService', () => {
  let gamesService: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: Api, useValue: mockApi },
        { provide: 'CACHE_MANAGER', useValue: mockCacheManager },
      ],
    }).compile();

    gamesService = module.get<GamesService>(GamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGame', () => {
    it('should return cached game if available', async () => {
      const cachedGame = [{ title: 'Cached Game' }];
      mockCacheManager.get.mockResolvedValue(cachedGame);

      const result = await gamesService.getGame({ title: 'Cached Game' });

      expect(result).toEqual(cachedGame);
      expect(mockCacheManager.get).toHaveBeenCalledWith('game_cached game');
      expect(mockPrismaService.game.findMany).not.toHaveBeenCalled();
    });

    it('should fetch game from database if not cached', async () => {
      const dbGame = [{ title: 'DB Game' }];
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.game.findMany.mockResolvedValue(dbGame);

      const result = await gamesService.getGame({ title: 'DB Game' });

      expect(result).toEqual(dbGame);
      expect(mockCacheManager.get).toHaveBeenCalledWith('game_db game');
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: { title: { contains: 'DB Game', mode: 'insensitive' } },
        include: { platforms: { include: { platform: true } } },
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith('game_db game', dbGame);
    });

    it('should fetch game from API if not in database', async () => {
      const apiGame = [
        {
          name: 'API Game',
          slug: 'api-game',
          platforms: [
            { platform: { id: 1, name: 'Platform 1', slug: 'platform-1' } },
          ],
          released: '2023-01-01',
          rating: 4.5,
          background_image: 'image.jpg',
        },
      ];
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.game.findMany.mockResolvedValue([]);
      mockApi.getGame.mockResolvedValue(apiGame);

      const result = await gamesService.getGame({ title: 'API Game' });

      expect(result).toEqual(expect.any(Array));
      expect(mockCacheManager.get).toHaveBeenCalledWith('game_api game');
      expect(mockApi.getGame).toHaveBeenCalledWith({ title: 'API Game' });
      expect(mockPrismaService.game.create).toHaveBeenCalledTimes(
        apiGame.length,
      );
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw an error if game is not found in API or database', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.game.findMany.mockResolvedValue([]);
      mockApi.getGame.mockResolvedValue([]);

      await expect(
        gamesService.getGame({ title: 'Nonexistent Game' }),
      ).rejects.toThrow('Game not found');
    });
  });

  describe('getAllGames', () => {
    it('should return all games without filters', async () => {
      const games = [{ title: 'Game 1' }, { title: 'Game 2' }];
      mockPrismaService.game.findMany.mockResolvedValue(games);

      const result = await gamesService.getAllGames();

      expect(result).toEqual(games);
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: {},
        include: { platforms: { include: { platform: true } } },
      });
    });

    it('should filter games by title', async () => {
      const games = [{ title: 'Filtered Game' }];
      mockPrismaService.game.findMany.mockResolvedValue(games);

      const result = await gamesService.getAllGames({ title: 'Filtered Game' });

      expect(result).toEqual(games);
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: { title: { equals: 'Filtered Game', mode: 'insensitive' } },
        include: { platforms: { include: { platform: true } } },
      });
    });

    it('should filter games by platform', async () => {
      const games = [{ title: 'Game on Platform' }];
      mockPrismaService.game.findMany.mockResolvedValue(games);

      const result = await gamesService.getAllGames({ platform: 'Platform' });

      expect(result).toEqual(games);
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: {
          platforms: {
            some: {
              platform: { name: { contains: 'Platform', mode: 'insensitive' } },
            },
          },
        },
        include: { platforms: { include: { platform: true } } },
      });
    });
  });
});
