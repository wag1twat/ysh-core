import 'reflect-metadata';

import { getHttpClientService } from '../hook';
import { HttpClientService } from '../service';

describe('HttpClientService', () => {
    test('health', () => {
        const httpClientService = getHttpClientService();

        expect(httpClientService).toBeInstanceOf(HttpClientService);
    });
});
