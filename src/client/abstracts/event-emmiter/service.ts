export abstract class AbstractEventEmitter {
    public abstract listeners: Set<() => void>;

    public abstract push<E extends string, V>(ev: E, value?: V, config?: EventInit): void;

    public abstract subscribe<E extends string, V>(
        e: E,
        callback: (e: CustomEvent<V>) => void,
    ): () => void;

    public abstract unsubscribeAll: () => void;
}
