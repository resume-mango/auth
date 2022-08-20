import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  coverageProvider: 'v8',
  verbose: true,
  transform: {
    '^.+\\.[t|j]s?$': 'ts-jest',
  },
  // transformIgnorePatterns: ['<rootDir>/node_modules/'],
}

export default config
