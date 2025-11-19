import { injectable } from 'inversify';
import querystring from 'query-string';

import {
    TCancelablePromise,
    TErrInterceptor,
    THttpClientProgressEvent,
    THttpClientRequestConfig,
    THttpClientResponse,
    THttpClientResponseHeaders,
    THttpClientResponseType,
    TInferHttpClientRequestConfig,
    TReqInterceptor,
    TResInterceptor,
} from '@/common/abstracts';

import { CancelablePromiseImpl } from './cancelable-promise-Impl';
import { HttpClientError } from './error';
import { HttpClientGuardsService } from './guards';

@injectable()
export class HttpClientService {
    public requestInterceptors = new Map<string, TReqInterceptor<THttpClientRequestConfig>>();
    public responseInterceptors = new Map<
        string,
        TResInterceptor<unknown, THttpClientRequestConfig>
    >();
    public errorInterceptors = new Map<string, TErrInterceptor<THttpClientRequestConfig>>();
    public controllers = new Map<string, AbortController>();

    constructor(private readonly guards: HttpClientGuardsService) {
        this.addRequestInterceptor('base-response', (requestConfig) => {
            const requestIdentifier = this.guards.requestIdentifier(requestConfig);

            const guards = this.guards.getGuards(requestIdentifier);

            this.guards.handleIsParams(requestConfig, guards);

            this.guards.handleIsPayload(requestConfig, guards);

            return requestConfig;
        });

        this.addResponseInterceptor('base-request', (data, requestConfig) => {
            const requestIdentifier = this.guards.requestIdentifier(requestConfig);

            const guards = this.guards.getGuards(requestIdentifier);

            const handled = this.guards.handleIsResult(data, requestConfig, guards);

            this.guards.deleteGuards(requestIdentifier);

            return handled;
        });
    }

    public addRequestInterceptor<T extends THttpClientRequestConfig>(
        key: string,
        fn: TReqInterceptor<T>,
    ) {
        if (!this.requestInterceptors.has(key)) {
            this.requestInterceptors.set(key, fn as never);
        }
    }

    public addResponseInterceptor<D, T extends THttpClientRequestConfig>(
        key: string,
        fn: TResInterceptor<D, T>,
    ) {
        if (!this.responseInterceptors.has(key)) {
            this.responseInterceptors.set(key, fn as never);
        }
    }

    public addErrorInterceptor<T extends THttpClientRequestConfig>(
        key: string,
        fn: TErrInterceptor<T>,
    ) {
        if (!this.errorInterceptors.has(key)) {
            this.errorInterceptors.set(key, fn as never);
        }
    }

    public addInterceptors<T extends THttpClientRequestConfig>(config: T) {
        config.interceptors?.response?.forEach(([key, interceptor]) => {
            this.addResponseInterceptor(key, interceptor);
        });
        config.interceptors?.request?.forEach(([key, interceptor]) => {
            this.addRequestInterceptor(key, interceptor);
        });
        config.interceptors?.error?.forEach(([key, interceptor]) => {
            this.addErrorInterceptor(key, interceptor);
        });
    }

    public request = <T extends THttpClientRequestConfig>(
        initial: T,
    ): TCancelablePromise<THttpClientResponse<TInferHttpClientRequestConfig<T>['result']>> => {
        this.addInterceptors(initial);

        this.guards.addGuards(this.guards.requestIdentifier(initial), initial.guards);

        const controller = new AbortController();

        const promise = this.pipeline<T>(initial, controller, 0);

        this.controllers.set(initial.url, controller);

        return new CancelablePromiseImpl<
            THttpClientResponse<TInferHttpClientRequestConfig<T>['result']>
        >(promise, () => controller.abort());
    };

    private async pipeline<T extends THttpClientRequestConfig>(
        initial: T,
        controller: AbortController,
        attempt: number,
    ): Promise<THttpClientResponse<TInferHttpClientRequestConfig<T>['result']>> {
        let requestConfig: T = {
            ...initial,
            headers: { ...initial.headers },
            signal: controller.signal,
            responseType: initial.responseType ?? 'json',
        };

        const requestInterceptors = this.requestInterceptors.values();

        for (const fn of requestInterceptors) {
            requestConfig = (await fn(requestConfig)) as T;
        }

        const url = this.buildURL(requestConfig);

        const [body, headers] = this.prepareBody(requestConfig.payload, requestConfig.headers);

        const raw = fetch(url, {
            ...requestConfig.fetchOptions,
            method: requestConfig.method,
            headers,
            body,
            signal: requestConfig.signal,
            cache: 'no-cache',
        });

        const response = requestConfig.timeoutMs
            ? await this.withTimeout(requestConfig.timeoutMs, raw, controller)
            : await raw;

        if (!response.ok) {
            const max = requestConfig.retries ?? 0;
            if (attempt < max) {
                const delay = requestConfig.retryDelay
                    ? requestConfig.retryDelay(attempt)
                    : 2 ** attempt * 200;
                await new Promise((r) => setTimeout(r, delay));
                return this.pipeline<T>(initial, controller, attempt + 1);
            }
            throw await this.parseError(response);
        }

        const data =
            requestConfig.onDownloadProgress && response.body
                ? await this.readBody(
                      response,
                      requestConfig.responseType,
                      requestConfig.onDownloadProgress,
                  )
                : await this.readBody(response, requestConfig.responseType);

        let final = data;

        const responseInterceptors = this.responseInterceptors.values();

        for (const fn of responseInterceptors) {
            final = (await fn(final, requestConfig)) as TInferHttpClientRequestConfig<T>['result'];
        }

        return {
            response: final,
            headers: this.parseHeaders(response.headers),
            statusText: response.statusText,
        } as THttpClientResponse<TInferHttpClientRequestConfig<T>['result']>;
    }

    private buildURL({ baseURL = '', url, params }: THttpClientRequestConfig): string {
        const prefix = [baseURL.replace(/\/+$/, ''), url.replace(/^\/+/, '')]
            .filter(Boolean)
            .join('/');

        const qsPart = params ? `?${querystring.stringify(params)}` : '';

        return prefix + qsPart;
    }

    private withTimeout<T>(
        ms: number,
        promise: Promise<T>,
        abortController: AbortController,
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                abortController.abort();
                reject(new Error(`Timeout ${ms} ms`));
            }, ms);
            promise.then(resolve, reject).finally(() => clearTimeout(id));
        });
    }

    private prepareBody(
        body: unknown,
        headers: Record<string, string> = {},
    ): [BodyInit | undefined, Record<string, string>] {
        if (
            body === undefined ||
            typeof body === 'string' ||
            body instanceof Blob ||
            body instanceof FormData
        )
            return [body as BodyInit, headers];
        if (headers['Content-Type']) return [body as BodyInit, headers];
        return [JSON.stringify(body), { ...headers, 'Content-Type': 'application/json' }];
    }

    private async readBody(
        response: Response,
        type: THttpClientResponseType | undefined,
        progress?: (e: THttpClientProgressEvent) => void,
    ): Promise<unknown> {
        if (!progress) {
            switch (type) {
                case 'blob':
                    try {
                        return await response.blob();
                    } catch {
                        return undefined;
                    }
                case 'text':
                    try {
                        return await response.text();
                    } catch {
                        return undefined;
                    }
                case 'json':
                    try {
                        return await response.json();
                    } catch {
                        return undefined;
                    }
                default:
                    try {
                        return await response.json();
                    } catch {
                        return await response.text();
                    }
            }
        }

        const totalHeader = response.headers.get('content-length');

        const total = totalHeader ? Number(totalHeader) : undefined;

        const reader = response.body!.getReader();

        const chunks: Uint8Array[] = [];

        let loaded = 0;

        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
                chunks.push(value);
                loaded += value.length;
                progress({ loaded, total, percent: total ? (loaded / total) * 100 : undefined });
            }
        }

        const size = chunks.reduce((s, c) => s + c.length, 0);

        const buffer = new Uint8Array(size);

        chunks.reduce((o, c) => {
            buffer.set(c, o);
            return o + c.length;
        }, 0);

        switch (type) {
            case 'blob':
                return new Blob([buffer], { type: 'application/octet-stream' });
            case 'text':
                return new TextDecoder().decode(buffer);
            case 'json':
            default:
                return JSON.parse(new TextDecoder().decode(buffer));
        }
    }

    private async parseError(response: Response): Promise<HttpClientError> {
        let text = '';
        let json: unknown;
        let blob: Blob | undefined = undefined;

        try {
            text = await response.clone().text();
        } catch {}

        try {
            json = await response.clone().json();
        } catch {}

        try {
            blob = await response.clone().blob();
        } catch {}

        return new HttpClientError(response.status, text, json, blob);
    }

    private parseHeaders(responseHeaders: Headers): THttpClientResponseHeaders {
        // const headers: THttpClientResponseHeaders = {};
        return responseHeaders;
    }

    public cleanup() {
        this.controllers.clear();
        this.responseInterceptors.clear();
        this.requestInterceptors.clear();
        this.errorInterceptors.clear();
        this.guards.cleanup();
    }
}
