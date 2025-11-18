import 'reflect-metadata';

import { act, renderHook } from '@testing-library/react';

import { useEventEmmiterService } from './useEventEmmiterService';

describe('useEventEmmiterService', () => {
    test('health', () => {
        const fn = jest.fn();

        const config1 = { data: 'event-1-detail-1' };
        const config2 = { data: 'event-1-detail-2' };
        const config3 = { data: 'event-1-detail-3' };

        const { result, unmount } = renderHook(() => useEventEmmiterService('event-1', fn));

        act(() => {
            result.current(config1);
        });

        expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: config1 }));
        expect(fn).toHaveBeenCalledTimes(1);

        act(() => {
            result.current(config2);
        });

        expect(fn).toHaveBeenCalledWith(expect.objectContaining({ detail: config2 }));
        expect(fn).toHaveBeenCalledTimes(2);

        unmount();

        act(() => {
            result.current(config3);
        });

        expect(fn).toHaveBeenCalledWith(expect.not.objectContaining({ detail: config3 }));
        expect(fn).toHaveBeenCalledTimes(2);
    });
});
