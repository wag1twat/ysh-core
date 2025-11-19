export interface TCancelablePromise<T> extends Promise<T> {
    cancel(): void;
}
