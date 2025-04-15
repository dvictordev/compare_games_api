import { type JestConfigWithTsJest, createDefaultPreset } from 'ts-jest';

const defaultPreset = createDefaultPreset();

const jestConfig: JestConfigWithTsJest = {
  ...defaultPreset,

  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '^generated/(.*)$': '<rootDir>/generated/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default jestConfig;
