import { CancelablePromiseImpl } from '../cancelable-promise-Impl';

describe('CancelablePromiseImpl', () => {
    it('should resolve correctly with then()', async () => {
        const cancelFn = jest.fn();

        const inner = Promise.resolve(1);

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        const result = await cp.then((v) => v + 1).then((v) => v * 2);

        expect(result).toBe(4);
        expect(cancelFn).not.toHaveBeenCalled();
    });

    it('should catch errors correctly with catch()', async () => {
        const error = new Error('Oops');

        const cancelFn = jest.fn();

        const inner = Promise.reject<number>(error);

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        const result = await cp.catch((e) => {
            expect(e).toBe(error);
            return 42;
        });

        expect(result).toBe(42);
        expect(cancelFn).not.toHaveBeenCalled();
    });

    it('should execute finally callback and propagate value', async () => {
        const cancelFn = jest.fn();

        const inner = Promise.resolve('done');

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        const finallyFn = jest.fn();

        const result = await cp.finally(finallyFn).then((v) => v);

        expect(result).toBe('done');
        expect(finallyFn).toHaveBeenCalledTimes(1);
        expect(cancelFn).not.toHaveBeenCalled();
    });

    it('should propagate rejection through finally', async () => {
        expect.assertions(3);

        const cancelFn = jest.fn();

        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        const inner = Promise.reject('fail');

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        const finallyFn = jest.fn();

        try {
            await cp.finally(finallyFn);
        } catch (e) {
            expect(e).toBe('fail');
            expect(finallyFn).toHaveBeenCalledTimes(1);
            expect(cancelFn).not.toHaveBeenCalled();
        }
    });

    it('should call cancel callback when cancel() is invoked', () => {
        const cancelFn = jest.fn();

        const inner = new Promise<void>(() => {});

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        cp.cancel();

        expect(cancelFn).toHaveBeenCalledTimes(1);
    });

    it('should preserve cancel behavior across chains', async () => {
        const cancelFn = jest.fn();

        let resolveInner: (value: number) => void;

        const inner = new Promise<number>((res) => {
            resolveInner = res;
        });

        const cp = new CancelablePromiseImpl(inner, cancelFn);

        const chained = cp
            .then((v) => v + 10)
            .catch(() => 0)
            .finally(() => {})
            .then((v) => v * 2);

        chained.cancel();

        expect(cancelFn).toHaveBeenCalledTimes(1);

        resolveInner!(5);

        const result = await chained;

        expect(result).toBe((5 + 10) * 2);
    });
});
