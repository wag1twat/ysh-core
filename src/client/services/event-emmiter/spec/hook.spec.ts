import 'reflect-metadata';

import { getEventEmitterService } from '../hook';
import { EventEmitterService } from '../service';

describe('EventEmitterService', () => {
    test('should correctly handle IoC container', () => {
        const eventEmitterService = getEventEmitterService();

        expect(eventEmitterService).toBeInstanceOf(EventEmitterService);
    });
});
