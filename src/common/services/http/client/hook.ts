import { getContainer } from '@/container';

import { HttpClientGuardsService } from './guards';
import { HttpClientService } from './service';

export function getHttpClientService(): HttpClientService {
    return getContainer().get(HttpClientService);
}

export function getHttpClientGuardsService(): HttpClientGuardsService {
    return getContainer().get(HttpClientGuardsService);
}
