import { injectable } from 'inversify';
import querystring from 'query-string';

import { THttpClientGuards, THttpClientRequestConfig } from '@/common/abstracts';
import { isServer } from '@/utils';

import { HttpClientError } from './error';

@injectable()
export class HttpClientGuardsService {
    private guards: Map<string, Partial<THttpClientGuards<unknown, unknown, unknown>>> = new Map();

    public requestIdentifier<Result = unknown, Params = unknown, Payload = unknown>(
        config: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
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

    public handleIsResult<Result = unknown, Params = unknown, Payload = unknown>(
        data: Result,
        requestConfig: THttpClientRequestConfig<Result, Params, Payload>,
        guards?: THttpClientRequestConfig<Result, Params, Payload>['guards'],
    ): Result {
        if (!guards?.isResult) return data;

        try {
            guards.isResult(data);
        } catch {
            const message = 'Bad Response';

            throw new HttpClientError(404, message);
        }

        return data;
    }

    public handleIsPayload<Result = unknown, Params = unknown, Payload = unknown>(
        requestConfig: THttpClientRequestConfig<Result, Params, Payload>,
        guards?: THttpClientRequestConfig<Result, Params, Payload>['guards'],
    ): THttpClientRequestConfig<Result, Params, Payload> {
        if (!guards?.isPayload) return requestConfig;

        try {
            guards.isPayload(requestConfig.payload);
        } catch {
            const message = 'Bad Payload';

            throw new HttpClientError(404, message);
        }

        return requestConfig;
    }

    public handleIsParams<Result = unknown, Params = unknown, Payload = unknown>(
        requestConfig: THttpClientRequestConfig<Result, Params, Payload>,
        guards?: THttpClientRequestConfig<Result, Params, Payload>['guards'],
    ): THttpClientRequestConfig<Result, Params, Payload> {
        if (!guards?.isParams) return requestConfig;

        try {
            guards.isParams(requestConfig.params);
        } catch {
            const message = 'Bad Params';

            throw new HttpClientError(404, message);
        }

        return requestConfig;
    }

    public cleanup() {
        this.guards.clear();
    }
}
