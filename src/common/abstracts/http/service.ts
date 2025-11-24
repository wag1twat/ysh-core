import { THttpClientRequestConfig, THttpClientResponse } from './client';

export abstract class AbstractHttpService {
    public abstract baseURL: string;
    public abstract request: <Result = unknown, Params = unknown, Payload = unknown>(
        config: THttpClientRequestConfig<Result, Params, Payload>,
    ) => Promise<THttpClientResponse<Result>>;
}
