export type THttpClientMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface THttpClientProgressEvent {
    loaded: number;
    total?: number;
    percent?: number;
}

export type THttpClientResponseType = 'json' | 'text' | 'blob';

export interface THttpClientServiceOptions {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    retries?: number;
    retryDelay?: (attempt: number) => number;
    fetchOptions?: Omit<RequestInit, 'method' | 'body' | 'headers' | 'signal'>;
}

type THttpClientGuardType<Target> = (arg: unknown) => Target | undefined;

type IsPayload<Payload, G = THttpClientGuardType<Payload>> = Payload extends undefined | FormData
    ? object
    : { isPayload: G };

type IsParams<Params, G = THttpClientGuardType<Params>> = Params extends undefined
    ? object
    : { isParams: G };

type IsResult<Result, G = THttpClientGuardType<Result>> = Result extends undefined | Blob
    ? object
    : { isResult: G };

export type THttpClientGuards<Result, Params, Payload> = IsResult<Result> &
    IsParams<Params> &
    IsPayload<Payload>;

export interface TPublicTHttpClientRequestConfig {
    headers?: Record<string, string>;
    onDownloadProgress?: (ev: THttpClientProgressEvent) => void;
    signal?: AbortSignal;
}

export interface THttpClientRequestConfig<Result = unknown, Params = unknown, Payload = unknown>
    extends THttpClientServiceOptions,
        TPublicTHttpClientRequestConfig {
    url: string;
    method?: THttpClientMethod;
    payload?: Payload;
    params?: Params;
    timeoutMs?: number;
    responseType?: THttpClientResponseType;
    guards?: THttpClientGuards<Result, Params, Payload>;
    interceptors?: {
        response?: [string, TResInterceptor<Result, THttpClientRequestConfig>][];
        request?: [string, TReqInterceptor<THttpClientRequestConfig>][];
        error?: [string, TErrInterceptor<THttpClientRequestConfig<Result, Params, Payload>>][];
    };
}

export type TInferHttpClientRequestConfig<T> =
    T extends THttpClientRequestConfig<infer R, infer P, infer L>
        ? { result: R; params: P; payload: L }
        : never;

export type TReqInterceptor<T extends THttpClientRequestConfig> = (cfg: T) => T | Promise<T>;

export type TResInterceptor<D, T extends THttpClientRequestConfig> = (
    data: D,
    cfg: T,
) => D | Promise<D>;

export type TErrInterceptor<T> = (err: unknown, cfg: T) => unknown;

export type THttpClientResponseHeaders = unknown;

export type THttpClientResponse<T = unknown> = {
    response: T;
    headers: THttpClientResponseHeaders;
    statusText: string;
};
