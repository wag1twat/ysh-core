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
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    verbose: true,
    testTimeout: 10000,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
    ],
    coverageReporters: ['lcov', 'text', 'html']
};
