export const generateRandomUser = () => ({
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'hashedpassword123',
});

export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  game: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

export const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

export const mockApi = {
  getGame: jest.fn(),
};

export const mockHashHelpers = {
  generateHash: jest.fn(),
  compareHash: jest.fn(),
};

export const mockJwtProviderService = {
  generateAccessToken: jest.fn(),
};
