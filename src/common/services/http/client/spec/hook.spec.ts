import 'reflect-metadata';

import { getHttpClientService } from '../hook';
import { HttpClientService } from '../service';

describe('HttpClientService', () => {
    test('should correctly handle IoC container', () => {
        const httpClientService = getHttpClientService();

        expect(httpClientService).toBeInstanceOf(HttpClientService);
    });
});
