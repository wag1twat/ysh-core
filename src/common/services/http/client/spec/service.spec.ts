import 'reflect-metadata';

import { HttpClientError } from '../error';
import { getHttpClientService } from '../hook';
import { HttpClientService } from '../service';

describe('HttpClientService', () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';

    const httpClientService = getHttpClientService();

    beforeEach(() => {
        httpClientService.cleanup();
    });

    test('should request correctly', async () => {
        expect(httpClientService).toBeInstanceOf(HttpClientService);

        expect(httpClientService.controllers.size).toBe(0);

        expect(httpClientService.request).toBeDefined();

        await httpClientService.request({ url: baseURL + '/todos' }).then((resolved) => {
            expect(resolved).toBeDefined();
            expect(resolved.headers).toBeDefined();
            expect(resolved.response).toBeDefined();
            expect(resolved.statusText).toBeDefined();
        });

        await httpClientService.request({ url: baseURL + '/todos/x' }).catch((error) => {
            expect(error).toBeInstanceOf(HttpClientError);
        });
    });

    test(' should addResponseInterceptor correctly', async () => {
        expect(httpClientService).toBeInstanceOf(HttpClientService);

        expect(httpClientService.controllers.size).toBe(0);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(httpClientService.addResponseInterceptor).toBeDefined();

        expect(httpClientService.request).toBeDefined();

        const data = [{ data: 'event-1' }];

        httpClientService.addResponseInterceptor('event-1', () => {
            return data;
        });

        await httpClientService.request({ url: baseURL + '/todos' }).then((resolved) => {
            expect(resolved).toBeDefined();
            expect(resolved.headers).toBeDefined();
            expect(resolved.response).toStrictEqual(data);
            expect(resolved.statusText).toBeDefined();
        });

        await httpClientService.request({ url: baseURL + '/todos/x' }).catch((error) => {
            expect(error).toBeInstanceOf(HttpClientError);
        });
    });

    test('should addRequestInterceptor correctly', async () => {
        expect(httpClientService).toBeInstanceOf(HttpClientService);

        expect(httpClientService.controllers.size).toBe(0);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(httpClientService.addRequestInterceptor).toBeDefined();

        expect(httpClientService.request).toBeDefined();

        httpClientService.addRequestInterceptor('event-1', (config) => {
            return { ...config, baseURL };
        });

        await httpClientService.request({ url: '/todos' }).then((resolved) => {
            expect(resolved).toBeDefined();
            expect(resolved.headers).toBeDefined();
            expect(resolved.response).toBeDefined();
            expect(resolved.statusText).toBeDefined();
        });

        await httpClientService.request({ url: '/todos/x' }).catch((error) => {
            expect(error).toBeInstanceOf(HttpClientError);
        });

        httpClientService.cleanup();
    });
});
