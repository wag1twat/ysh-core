import { v4 } from 'uuid';
import { z } from 'zod/v4';

import { THttpClientRequestConfig } from '@/common/abstracts';

import { HttpClientError } from '../error';
import { getHttpClientGuardsService } from '../hook';

const group = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
const gEnd = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

afterAll(() => {
    group.mockRestore();
    warn.mockRestore();
    gEnd.mockRestore();
});

const makeCfg = (over: Partial<THttpClientRequestConfig> = {}): THttpClientRequestConfig => ({
    baseURL: 'https://jsonplaceholder.typicode.com',
    url: '/todos',
    method: 'GET',
    params: {},
    payload: {},
    guards: undefined,
    ...over,
});

describe('HttpClientGuardsService', () => {
    const httpClientService = getHttpClientGuardsService();

    describe('requestIdentifier', () => {
        it('builds deterministic identifier string', () => {
            const cfg = makeCfg({
                params: { q: 'hi' },
                payload: { foo: 1 },
            });

            const id = httpClientService.requestIdentifier(cfg);

            expect(id).toBe(
                'https://jsonplaceholder.typicode.com_/todos_q=hi_foo=1_GET_is_server=false',
            );
        });
    });

    describe('should guards map helpers correctly', () => {
        it('add / get / delete round-trip', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            httpClientService.addGuards('key', guards);

            expect(httpClientService.getGuards('key')).toBe(guards);

            httpClientService.deleteGuards('key');

            expect(httpClientService.getGuards('key')).toBeUndefined();
        });
    });

    describe('should handleIsResult correctly', () => {
        it('returns data untouched when guard not present', () => {
            const data = { ok: true };
            const out = httpClientService.handleIsResult(data, makeCfg());

            expect(out).toBe(data);
        });

        it('invokes guard and returns original data on success', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            const cfg = makeCfg({ guards, params: { q: 1 }, payload: { x: 1 } });

            const data = { foo: 1 };

            const out = httpClientService.handleIsResult(data, cfg, cfg.guards);

            expect(guards.isResult).toHaveBeenCalledWith(data);

            expect(out).toBe(data);
        });

        it('marks invalid fields when Zod validation fails', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            const schema = z.object({ foo: z.number() });

            const cfg = makeCfg({
                guards: {
                    ...guards,
                    isResult: (arg) => schema.parse(arg),
                },
            });

            const data = { bar: 1 };

            const out = httpClientService.handleIsResult(data, cfg, cfg.guards);

            expect(out).toHaveProperty('$invalid', true);
        });
    });

    describe('should handleIsPayload correctly', () => {
        it('passes through when guard not present', () => {
            const cfg = makeCfg();

            const out = httpClientService.handleIsPayload(cfg, cfg.guards);

            expect(out).toBe(cfg);
        });

        it('throws HttpClientError on Zod validation error', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            const schema = z.object({ id: z.number() });

            const cfg = makeCfg({
                method: 'POST',
                payload: { id: v4() },
                guards: { ...guards, isPayload: (arg) => schema.parse(arg) },
            });

            expect(() => httpClientService.handleIsPayload(cfg, cfg.guards)).toThrow(
                HttpClientError,
            );

            try {
                httpClientService.handleIsPayload(cfg, cfg.guards);
            } catch (e) {
                if (e instanceof HttpClientError) {
                    expect(e.status).toBe(404);
                }
            }
        });
    });

    describe('should handleIsParams correctly', () => {
        it('throws HttpClientError on generic exception', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const guard = (_: unknown) => {
                throw new Error('boom');
            };
            const cfg = makeCfg({ params: { page: -1 }, guards: { ...guards, isParams: guard } });

            expect(() => httpClientService.handleIsParams(cfg, cfg.guards)).toThrow(
                HttpClientError,
            );
        });

        it('returns config on valid params', () => {
            const guards = {
                isPayload: jest.fn(),
                isResult: jest.fn(),
                isParams: jest.fn(),
            };

            const cfg = makeCfg({ guards });

            const out = httpClientService.handleIsParams(cfg, cfg.guards);

            expect(out).toBe(cfg);

            expect(guards.isParams).toHaveBeenCalledWith(cfg.params);
        });
    });

    describe('should cleanup correctly', () => {
        it('clears all guards', () => {
            httpClientService.addGuards('k1', {});
            httpClientService.addGuards('k2', {});

            expect(httpClientService.getGuards('k1')).toBeDefined();

            httpClientService.cleanup();

            expect(httpClientService.getGuards('k1')).toBeUndefined();
            expect(httpClientService.getGuards('k2')).toBeUndefined();
        });
    });
});
