import 'reflect-metadata';

import { Container, Factory, ResolutionContext } from 'inversify';

import { HttpService } from '@/common';
import { RestService } from '@/common/services';

import { TYPES } from './types';

const serverContainer = new Container({ defaultScope: 'Singleton', autobind: true });

serverContainer.bind(HttpService).to(HttpService).inRequestScope();

serverContainer
    .bind<Factory<HttpService>>(TYPES['Factory<HttpService>'])
    .toFactory((context: ResolutionContext) => {
        return (baseURL: string) => {
            return context.get(HttpService, { tag: { key: TYPES.baseURL, value: baseURL } });
        };
    });

serverContainer
    .bind<Factory<RestService>>(TYPES['Factory<RestService>'])
    .toFactory((context: ResolutionContext) => {
        return (baseURL: string) => {
            return context.get(RestService, { tag: { key: TYPES.baseURL, value: baseURL } });
        };
    });

export { serverContainer };
