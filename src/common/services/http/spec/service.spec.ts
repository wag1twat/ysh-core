import 'reflect-metadata';

import { getContainer } from '@/container';
import { TYPES } from '@/container/types';

import { HttpClientError } from '../client';
import { getHttpService } from '../hook';
import { HttpService } from '../service';

describe('HttpService', () => {
    const url = 'https://jsonplaceholder.typicode.com';

    const container = getContainer();

    container.bind<string>(TYPES.baseURL).toConstantValue('https://jsonplaceholder.typicode.com');

    const httpService = getHttpService();

    beforeEach(() => {
        httpService.cleanup();
    });

    test('should request correctly', async () => {
        expect(httpService).toBeInstanceOf(HttpService);

        expect(httpService.baseURL).toBe(url);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(httpService.request).toBeDefined();

        await httpService.request({ url: '/todos' }).then((resolved) => {
            expect(resolved).toBeDefined();
            expect(resolved.headers).toBeDefined();
            expect(resolved.response).toBeDefined();
            expect(resolved.statusText).toBeDefined();
        });

        await httpService.request({ url: '/todos/x' }).catch((error) => {
            expect(error).toBeInstanceOf(HttpClientError);
        });
    });

    test('should interceptors correctly stack size', async () => {
        expect(httpService).toBeInstanceOf(HttpService);

        expect(httpService.baseURL).toBe(url);

        const fn = async () => {
            await httpService
                .request({
                    url: '/todos',
                    interceptors: {
                        response: [
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ['1', (data) => 1],
                            ['2', (data) => (data as number) + 1],
                            ['3', (data) => (data as number) + 1],
                            ['4', (data) => (data as number) + 1],
                        ],
                    },
                })
                .then((resolved) => {
                    expect(resolved).toBeDefined();
                    expect(resolved.headers).toBeDefined();
                    expect(resolved.response).toBe(4);
                    expect(resolved.statusText).toBeDefined();
                });
        };

        await Promise.all([fn(), fn(), fn()]);

        expect(httpService.httpClientService.responseInterceptors.size).toBe(4);
    });
});
