/** @type {import('jest').Config} */

const esModules = [
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
    'inversify',
    'reflect-metadata',
].join('|');

module.exports = {
    projects: [
        {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^query-string$': '<rootDir>/__mocks__/query-string.js',
            },
            preset: undefined,
            roots: ['<rootDir>/src'],
            moduleDirectories: ['node_modules', '<rootDir>/src'],
            testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/'],
            setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
            testEnvironment: 'jsdom',
            transform: {
                '^.+\\.(ts|tsx)$': ['babel-jest'],
            },
            transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
            displayName: 'client',
            testMatch: ['<rootDir>/src/client/**/*.test.ts', '<rootDir>/src/client/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/client/**/*.{ts,tsx}',
                '!<rootDir>/src/client/**/*.d.ts',
                '!<rootDir>/src/client/abstracts/**',
            ],
        },
        {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^query-string$': '<rootDir>/__mocks__/query-string.js',
            },
            preset: undefined,
            roots: ['<rootDir>/src'],
            moduleDirectories: ['node_modules', '<rootDir>/src'],
            testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/'],
            setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
            testEnvironment: 'node',
            transform: {
                '^.+\\.(ts|tsx)$': ['babel-jest'],
            },
            transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
            displayName: 'server',
            testMatch: ['<rootDir>/src/server/**/*.test.ts', '<rootDir>/src/server/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/server/**/*.{ts,tsx}',
                '!<rootDir>/src/server/**/*.d.ts',
                '!<rootDir>/src/server/abstracts/**',
            ],
        },
        {
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
                '^query-string$': '<rootDir>/__mocks__/query-string.js',
            },
            preset: undefined,
            roots: ['<rootDir>/src'],
            moduleDirectories: ['node_modules', '<rootDir>/src'],
            testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/coverage/'],
            setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
            testEnvironment: 'node',
            transform: {
                '^.+\\.(ts|tsx)$': ['babel-jest'],
            },
            transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
            displayName: 'common',
            testMatch: ['<rootDir>/src/common/**/*.test.ts', '<rootDir>/src/common/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/common/**/*.{ts,tsx}',
                '!<rootDir>/src/common/**/*.d.ts',
                '!<rootDir>/src/common/abstracts/**',
            ],
        },
    ],
};
