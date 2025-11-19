import 'reflect-metadata';

import { getEventEmitterService } from '../hook';
import { EventEmitterService } from '../service';

describe('EventEmitterService', () => {
    test('health', () => {
        const eventEmitterService = getEventEmitterService();

        expect(eventEmitterService).toBeInstanceOf(EventEmitterService);
    });
});
