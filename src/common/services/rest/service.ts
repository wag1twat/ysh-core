import { inject, injectable } from 'inversify';

import { TYPES } from '@/container/types';

import {
    AbstractRestService,
    THttpClientRequestConfig,
    THttpClientResponse,
} from '@/common/abstracts';

import { HttpService } from '../http';

@injectable()
class RestService implements AbstractRestService {
    private httpService: HttpService;

    constructor(
        @inject(TYPES.baseURL) public baseURL: string,
        @inject(TYPES['Factory<HttpService>']) httpServiceFactory: (baseURL: string) => HttpService,
    ) {
        this.httpService = httpServiceFactory(baseURL);
    }

    public get<Result = object, Params = object>(
        override: THttpClientRequestConfig<Result, Params, unknown>,
    ): Promise<THttpClientResponse<Result>> {
        return this.httpService.request<Result, Params, unknown>({
            method: 'GET',
            ...override,
        });
    }

    public post<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        return this.httpService.request<Result, Params, Payload>({
            method: 'POST',
            ...override,
        });
    }

    public put<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        return this.httpService.request<Result, Params, Payload>({
            method: 'PUT',
            ...override,
        });
    }

    public patch<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        return this.httpService.request<Result, Params, Payload>({
            method: 'PATCH',
            ...override,
        });
    }

    public delete<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        return this.httpService.request<Result, Params, Payload>({
            method: 'DELETE',
            ...override,
        });
    }

    public head<Result = unknown, Params = unknown, Payload = unknown>(
        override: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        return this.httpService.request<Result, Params, Payload>({
            method: 'HEAD',
            ...override,
        });
    }
}

export { RestService };
