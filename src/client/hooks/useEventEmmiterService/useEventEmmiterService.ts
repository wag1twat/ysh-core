import { useEffect, useState } from 'react';

import { getEventEmitterService } from '@/client/services/event-emmiter/hook';

export function useEventEmmiterService<
    E extends string,
    V,
    C extends (e: CustomEvent<unknown>) => void,
>(e: E, callback: C) {
    const [service] = useState(() => getEventEmitterService());

    useEffect(() => {
        const unsubscribe = service.subscribe(e, callback);

        return unsubscribe;
    }, [callback, e]);

    return (value: V) => service.push(e, value);
}
