/** @type {import('jest').Config} */
export default {
    projects: [
        {
            preset: 'ts-jest/presets/default-esm',
            testEnvironment: 'jsdom',
            extensionsToTreatAsEsm: ['.ts'],
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
            },
            displayName: 'client',
            testMatch: ['<rootDir>/src/client/**/*.test.ts', '<rootDir>/src/client/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/client/**/*.{ts,tsx}',
                '!<rootDir>/src/client/**/*.d.ts',
                '!<rootDir>/src/client/abstracts/**'
            ],
        },
        {
            preset: 'ts-jest',
            testEnvironment: 'node',
            extensionsToTreatAsEsm: ['.ts'],
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
            },
            displayName: 'server',
            testMatch: ['<rootDir>/src/server/**/*.test.ts', '<rootDir>/src/server/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/server/**/*.{ts,tsx}',
                '!<rootDir>/src/server/**/*.d.ts',
                '!<rootDir>/src/server/abstracts/**'
            ],
        },
        {
            preset: 'ts-jest/presets/default-esm',
            testEnvironment: 'node',
            extensionsToTreatAsEsm: ['.ts'],
            moduleNameMapper: {
                '^@/(.*)$': '<rootDir>/src/$1',
            },
            displayName: 'common',
            testMatch: ['<rootDir>/src/common/**/*.test.ts', '<rootDir>/src/common/**/*.spec.ts'],
            collectCoverageFrom: [
                '<rootDir>/src/common/**/*.{ts,tsx}',
                '!<rootDir>/src/common/**/*.d.ts',
                '!<rootDir>/src/common/abstracts/**'
            ],
        },
    ],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.json',
                diagnostics: {
                    warnOnly: true,
                },
            },
        ],
    },
    moduleDirectories: ['node_modules', 'src'],
    verbose: true,
    testTimeout: 10000, 
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/',
        '/coverage/',
        '/.github/',
        '/docs/',
        '/src/client/abstracts/',
        '/src/server/abstracts/', 
        '/src/common/abstracts/'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/',
        '/coverage/',
        '/.github/',
        '/src/client/abstracts/',
        '/src/server/abstracts/',
        '/src/common/abstracts/'
    ],
    coverageReporters: ['lcov', 'text', 'html'],
    passWithNoTests: true
};
