import 'reflect-metadata';

import { getEventEmitterService } from '../hook';
import { EventEmitterService } from '../service';

describe('EventEmitterService', () => {
    let eventEmitterService: EventEmitterService;

    beforeEach(() => {
        eventEmitterService = getEventEmitterService();
    });

    afterEach(() => {
        eventEmitterService.unsubscribeAll();
    });

    test('should subscribe correctly', () => {
        const fn = jest.fn();

        const type = 'event-1';

        const config1 = { data: 'event-1-detail-1' };
        const config2 = { data: 'event-1-detail-2' };

        const unsubscribe = eventEmitterService.subscribe(type, fn);

        eventEmitterService.push(type, config1);

        expect(eventEmitterService.listeners.size).toBe(1);
        expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: config1 }));
        expect(fn).toHaveBeenCalledTimes(1);

        eventEmitterService.push(type, config2);

        expect(eventEmitterService.listeners.size).toBe(1);
        expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: config2 }));
        expect(fn).toHaveBeenCalledTimes(2);

        unsubscribe();

        expect(eventEmitterService.listeners.size).toBe(0);
    });
});
