import { getContainer } from '@/container';

import { HttpClientService } from './service';

export function getHttpClientService(): HttpClientService {
    return getContainer().get(HttpClientService);
}
