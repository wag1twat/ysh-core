export class HttpClientError extends Error {
    constructor(
        public readonly status: number,
        public readonly text: string | undefined,
        public readonly json: unknown = undefined,
        public readonly blob: Blob | undefined = undefined,
    ) {
        super(`HTTP ${status}: ${text}`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
