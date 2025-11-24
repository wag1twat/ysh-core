import { inject, injectable } from 'inversify';

import { TYPES } from '@/container/types';

import { AbstractHttpService, THttpClientRequestConfig } from '../../abstracts';
import { HttpClientService } from './client';

@injectable()
class HttpService implements AbstractHttpService {
    constructor(
        @inject(TYPES.baseURL) public baseURL: string,
        public httpClientService: HttpClientService,
    ) {
        this.request = this.request.bind(this);
    }

    public async request<Result = unknown, Params = unknown, Payload = unknown>(
        config: THttpClientRequestConfig<Result, Params, Payload>,
    ) {
        this.httpClientService.addInterceptors(config);

        return this.httpClientService
            .request<Result, Params, Payload>({
                baseURL: this.baseURL,
                timeoutMs: 15000,
                ...config,
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    }

    public cleanup() {
        this.httpClientService.cleanup();
    }
}

export { HttpService };
