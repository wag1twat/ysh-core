import { get, isObject, set } from 'es-toolkit/compat';
import { injectable } from 'inversify';
import querystring from 'query-string';
import { z } from 'zod/v4';

import { THttpClientGuards, THttpClientRequestConfig } from '@/common/abstracts';
import { isServer } from '@/utils';

import { HttpClientError } from './error';

@injectable()
export class HttpClientGuardsService {
    private guards: Map<string, Partial<THttpClientGuards<unknown, unknown, unknown>>> = new Map();

    public requestIdentifier<T extends THttpClientRequestConfig>(config: T) {
        const identifiers: string[] = [
            config.baseURL || '',
            `${config.url}`,
            querystring.stringify(config.params as object),
            querystring.stringify(config.payload as object),
            `${config.method}`,
            `is_server=${isServer()}`,
        ];

        return identifiers.join('_');
    }

    public addGuards<T extends THttpClientGuards<unknown, unknown, unknown>>(
        key: string,
        guards: Partial<T> = {},
    ) {
        this.guards.set(key, guards);
    }

    public getGuards<T extends THttpClientGuards<unknown, unknown, unknown>>(
        key: string,
    ): T | undefined {
        return this.guards.get(key) as T;
    }

    public deleteGuards(key: string) {
        this.guards.delete(key);
    }

    public handleIsResult<T extends THttpClientRequestConfig>(
        data: unknown,
        requestConfig: THttpClientRequestConfig,
        guards?: T['guards'],
    ) {
        if (!guards?.isResult) return data;

        try {
            guards.isResult(data);
        } catch (error) {
            const href = `${requestConfig.baseURL || ''}${requestConfig.url}`;

            if (error instanceof z.ZodError) {
                console.groupCollapsed(`[BAD_RESPONSE]: ${href}`);
                console.warn(z.prettifyError(error));
                console.groupEnd();

                if (Array.isArray(data) || isObject(data)) {
                    error.issues.forEach((issue) => {
                        issue.path.forEach((_, index, array) => {
                            const path = array.slice(0, index + 1);

                            const item = get(data, path) as unknown;

                            if (!Array.isArray(item) && isObject(item)) {
                                set(data, path.concat(['$invalid']), true);
                            } else {
                                set(data, '$invalid', true);
                            }
                        });
                    });
                }
            } else {
                console.groupCollapsed(`[BAD_RESPONSE]: ${href}`);
                console.warn(data);
                console.groupEnd();
            }
        }

        return data;
    }

    public handleIsPayload<T extends THttpClientRequestConfig>(
        requestConfig: T,
        guards?: T['guards'],
    ) {
        if (!guards?.isPayload) return requestConfig;

        try {
            guards.isPayload(requestConfig.payload);
        } catch (data) {
            let message = 'Bad Payload';

            const href = `${requestConfig.baseURL || ''}${requestConfig.url}`;

            if (data instanceof z.ZodError) {
                message = JSON.stringify(
                    {
                        errors: z.prettifyError(data),
                        source: requestConfig.payload,
                    },
                    null,
                    2,
                );
                console.groupCollapsed(`[BAD_PAYLOAD]: ${href}`);
                console.warn(data);
                console.warn(z.prettifyError(data));
                console.groupEnd();
            } else {
                console.groupCollapsed(`[BAD_PAYLOAD]: ${href}`);
                console.warn(data);
                console.groupEnd();
            }

            throw new HttpClientError(404, message);
        }
    }

    public handleIsParams<T extends THttpClientRequestConfig>(
        requestConfig: T,
        guards?: T['guards'],
    ) {
        if (!guards?.isParams) return requestConfig;

        try {
            guards.isParams(requestConfig.params);
        } catch (data) {
            let message = 'Bad Params';

            const href = `${requestConfig.baseURL || ''}${requestConfig.url}`;

            if (data instanceof z.ZodError) {
                message = JSON.stringify(
                    {
                        errors: z.prettifyError(data),
                        source: requestConfig.params,
                    },
                    null,
                    2,
                );
                console.groupCollapsed(`[BAD_PARAMS]: ${href}`);
                console.warn(data);
                console.warn(z.prettifyError(data));
                console.groupEnd();
            } else {
                console.groupCollapsed(`[BAD_PARAMS]: ${href}`);
                console.warn(data);
                console.groupEnd();
            }

            throw new HttpClientError(404, message);
        }
    }

    public cleanup() {
        this.guards.clear();
    }
}
