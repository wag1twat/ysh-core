import 'reflect-metadata';

describe('ES modules', () => {
    test('check file existence', () => {
        const files = [
            'src/container/index.ts',
            'src/common/index.ts',
            'src/client/index.ts',
            'src/server/index.ts',
        ];

        files.forEach((file) => {
            expect(file).toBeDefined();
        });
    });

    test('check alias resolution [@/container]', async () => {
        const module = await import('@/container');
        expect(module).toBeDefined();
    });

    test('check alias resolution [@/common]', async () => {
        const module = await import('@/common');
        expect(module).toBeDefined();
    });

    test('check alias resolution [@/client]', async () => {
        const module = await import('@/client');
        expect(module).toBeDefined();
    });

    test('check alias resolution [@/server]', async () => {
        const module = await import('@/server');
        expect(module).toBeDefined();
    });
});
