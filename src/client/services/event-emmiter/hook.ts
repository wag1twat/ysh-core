import { container } from '@/client/container';

import { EventEmitterService } from './service';

export function getEventEmitterService(): EventEmitterService {
    return container.get(EventEmitterService);
}
