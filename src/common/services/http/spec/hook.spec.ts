import 'reflect-metadata';

import { getContainer } from '@/container';
import { TYPES } from '@/container/types';

import { getHttpService } from '../hook';
import { HttpService } from '../service';

describe('HttpService', () => {
    test('should correctly handle IoC container', () => {
        const url = 'https://jsonplaceholder.typicode.com';

        const container = getContainer();

        container
            .bind<string>(TYPES.baseURL)
            .toConstantValue('https://jsonplaceholder.typicode.com');

        const httpService = getHttpService();

        expect(httpService).toBeInstanceOf(HttpService);

        expect(httpService.baseURL).toBe(url);
    });
});
