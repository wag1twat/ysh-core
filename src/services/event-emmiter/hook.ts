import { container } from '@/container';

import { EventEmitterService } from './service';

export function getEventEmitterService(): EventEmitterService {
    return container.get(EventEmitterService);
}
