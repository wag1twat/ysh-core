import { getContainer } from '@/container';

import { EventEmitterService } from './service';

export function getEventEmitterService(): EventEmitterService {
    return getContainer().get(EventEmitterService);
}
