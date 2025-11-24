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

export type THttpClientGuards<Result = unknown, Params = unknown, Payload = unknown> = {
    isParams?: THttpClientGuardType<Params>;
    isPayload?: THttpClientGuardType<Payload>;
    isResult?: THttpClientGuardType<Result>;
};

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
        response?: [string, TResInterceptor<Result, Params, Payload>][];
        request?: [string, TReqInterceptor][];
        error?: [string, TErrInterceptor][];
    };
}

// export type TInferHttpClientRequestConfig<T> =
//     T extends THttpClientRequestConfig<infer R, infer P, infer L>
//         ? { result: R; params: P; payload: L }
//         : never;

export type TReqInterceptor<Result = unknown, Params = unknown, Payload = unknown> = (
    cfg: THttpClientRequestConfig<Result, Params, Payload>,
) =>
    | THttpClientRequestConfig<Result, Params, Payload>
    | Promise<THttpClientRequestConfig<Result, Params, Payload>>;

export type TResInterceptor<Result = unknown, Params = unknown, Payload = unknown> = (
    data: Result,
    cfg: THttpClientRequestConfig<Result, Params, Payload>,
) => Result | Promise<Result>;

export type TErrInterceptor<Result = unknown, Params = unknown, Payload = unknown> = (
    err: unknown,
    cfg: THttpClientRequestConfig<Result, Params, Payload>,
) => unknown;

export type THttpClientResponseHeaders = unknown;

export type THttpClientResponse<T = unknown> = {
    response: T;
    headers: THttpClientResponseHeaders;
    statusText: string;
};
