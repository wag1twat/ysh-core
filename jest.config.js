/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
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
    testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    verbose: true,
    testTimeout: 10000,
};
