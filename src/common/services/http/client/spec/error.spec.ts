import { HttpClientError } from '../error';

describe('HttpClientError', () => {
    it('should be instance of Error and HttpClientError', () => {
        const err = new HttpClientError(400, 'Bad Request');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(HttpClientError);
    });

    it('should set status and text properties', () => {
        const status = 404;
        const text = 'Not Found';
        const err = new HttpClientError(status, text);

        expect(err.status).toBe(status);
        expect(err.text).toBe(text);
    });

    it('should set default json and blob to undefined when not provided', () => {
        const err = new HttpClientError(500, 'Server Error');

        expect(err.json).toBeUndefined();
        expect(err.blob).toBeUndefined();
    });

    it('should set json and blob properties when provided', () => {
        const status = 200;
        const text = 'OK';
        const json = { data: 'value' };
        const blob = new Blob(['hello'], { type: 'text/plain' });

        const err = new HttpClientError(status, text, json, blob);

        expect(err.json).toBe(json);
        expect(err.blob).toBe(blob);
    });

    it('should generate correctly message', () => {
        const status = 403;
        const text = 'Forbidden';
        const err = new HttpClientError(status, text);

        expect(err.message).toBe(`HTTP ${status}: ${text}`);
    });

    it('should preserve prototype chain for instanceof checks', () => {
        const err = new HttpClientError(418, "I'm a teapot");
        expect(err instanceof HttpClientError).toBe(true);
        expect(err instanceof Error).toBe(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(Object.getPrototypeOf(err).constructor.name).toBe('HttpClientError');
    });
});
