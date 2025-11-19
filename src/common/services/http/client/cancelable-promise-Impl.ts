import { TCancelablePromise } from '@/common/abstracts';

export class CancelablePromiseImpl<T> implements TCancelablePromise<T>, PromiseLike<T> {
    [Symbol.toStringTag] = 'CancelablePromise';

    constructor(
        private readonly inner: Promise<T>,
        private readonly _cancel: () => void,
    ) {}

    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
        onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
    ): CancelablePromiseImpl<TResult1 | TResult2> {
        const next = this.inner.then(onFulfilled, onRejected);
        return new CancelablePromiseImpl(next, this._cancel);
    }

    catch<TResult = never>(
        onRejected?: (reason: unknown) => TResult | PromiseLike<TResult>,
    ): CancelablePromiseImpl<T | TResult> {
        const next = this.inner.catch(onRejected);
        return new CancelablePromiseImpl(next, this._cancel);
    }

    finally(onFinally?: () => void): CancelablePromiseImpl<T> {
        const next = this.inner.finally(onFinally);
        return new CancelablePromiseImpl(next, this._cancel);
    }

    cancel(): void {
        this._cancel();
    }
}
