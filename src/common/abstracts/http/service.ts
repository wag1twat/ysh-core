import {
    THttpClientRequestConfig,
    THttpClientResponse,
    TInferHttpClientRequestConfig,
} from './client';

export abstract class AbstractHttpService {
    public abstract baseURL: string;
    public abstract request: <T extends THttpClientRequestConfig>(
        config: T,
    ) => Promise<THttpClientResponse<TInferHttpClientRequestConfig<T>['result']>>;
}
