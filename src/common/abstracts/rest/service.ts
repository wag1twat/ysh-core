import { THttpClientRequestConfig, THttpClientResponse } from '../http';

export abstract class AbstractRestService {
    public abstract baseURL: string;

    public abstract get<Result = unknown, Params = unknown>(
        override: THttpClientRequestConfig<Result, Params, unknown>,
    ): Promise<THttpClientResponse<Result>>;

    public abstract post<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ): Promise<THttpClientResponse<Result>>;

    public abstract put<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ): Promise<THttpClientResponse<Result>>;

    public abstract patch<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ): Promise<THttpClientResponse<Result>>;
    public abstract delete<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ): Promise<THttpClientResponse<Result>>;

    public abstract head<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ): Promise<THttpClientResponse<Result>>;
}
