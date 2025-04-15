import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { HashHelpers } from 'src/shared/helpers/hash.helper';
import { JwtProviderService } from 'src/shared/services/jwt-provider.service';
import { BadRequestException } from '@nestjs/common';
import {
  generateRandomUser,
  mockPrismaService,
  mockHashHelpers,
  mockJwtProviderService,
} from './utils/_mocks';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HashHelpers, useValue: mockHashHelpers },
        { provide: JwtProviderService, useValue: mockJwtProviderService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeUser', () => {
    it('should create a new user', async () => {
      const user = generateRandomUser();
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockHashHelpers.generateHash.mockResolvedValue('hashedpassword123');
      mockPrismaService.user.create.mockResolvedValue({
        name: user.name,
        email: user.email,
      });

      const result = await authService.storeUser(user);

      expect(result).toEqual({
        name: user.name,
        email: user.email,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(mockHashHelpers.generateHash).toHaveBeenCalledWith(user.password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: user.name,
          email: user.email,
          password: 'hashedpassword123',
        },
        select: {
          name: true,
          email: true,
        },
      });
    });

    it('should throw an error if user already exists', async () => {
      const user = generateRandomUser();
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(authService.storeUser(user)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const user = generateRandomUser();
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockHashHelpers.compareHash.mockResolvedValue(true);
      mockJwtProviderService.generateAccessToken.mockResolvedValue('token123');

      const result = await authService.login({
        email: user.email,
        password: user.password,
      });

      expect(result).toEqual({ token: 'token123' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(mockHashHelpers.compareHash).toHaveBeenCalledWith(
        user.password,
        user.password,
      );
      expect(mockJwtProviderService.generateAccessToken).toHaveBeenCalledWith({
        sub: user.email,
        expiresIn: '60m',
      });
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'notfound@example.com', password: '123' }),
      ).rejects.toThrow(new BadRequestException('User not found'));
    });

    it('should throw an error for invalid password', async () => {
      const user = generateRandomUser();
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockHashHelpers.compareHash.mockResolvedValue(false);

      await expect(
        authService.login({ email: user.email, password: 'wrongpassword' }),
      ).rejects.toThrow(new BadRequestException('Invalid password!'));
    });
  });

  describe('show', () => {
    it('should return user details', async () => {
      const user = generateRandomUser();
      mockPrismaService.user.findUnique.mockResolvedValue({
        name: user.name,
        email: user.email,
      });

      const result = await authService.show(user.email);

      expect(result).toEqual({
        name: user.name,
        email: user.email,
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: user.email },
        select: { name: true, email: true },
      });
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.show('notfound@example.com')).rejects.toThrow(
        new BadRequestException('User not found'),
      );
    });
  });
});
