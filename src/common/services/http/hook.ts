import { getContainer } from '@/container';

import { HttpService } from './service';

export function getHttpService(): HttpService {
    return getContainer().get(HttpService);
}
