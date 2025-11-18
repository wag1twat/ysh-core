import { injectable } from 'inversify';

import { AbstractEventEmitter } from '@/abstracts';

@injectable()
class EventEmitterService implements AbstractEventEmitter {
    constructor() {
        this.push = this.push.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribeAll = this.unsubscribeAll.bind(this);
    }

    public listeners = new Set<() => void>();

    public push<E extends string, V>(e: E, value?: V, config?: EventInit) {
        const event = new CustomEvent(e, {
            detail: value,
            ...config,
        });

        document.dispatchEvent(event);
    }

    public subscribe<E extends string, V>(e: E, callback: (e: CustomEvent<V>) => void): () => void {
        document.addEventListener(e, callback as EventListenerOrEventListenerObject);

        const unsubscribe = () => {
            document.removeEventListener(e, callback as EventListenerOrEventListenerObject, false);
        };

        this.listeners.add(unsubscribe);

        return () => {
            unsubscribe();
            this.listeners.delete(unsubscribe);
        };
    }

    public unsubscribeAll() {
        this.listeners.forEach((fn, _, set) => {
            fn();
            set.delete(fn);
        });
    }
}

export { EventEmitterService };
