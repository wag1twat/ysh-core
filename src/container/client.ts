import 'reflect-metadata';

import { Container, Factory, ResolutionContext } from 'inversify';

import { EventEmitterService } from '@/client/services';
import { HttpService, RestService } from '@/common/services';

import { TYPES } from './types';

const clientContainer = new Container({ defaultScope: 'Singleton', autobind: true });

clientContainer.bind(EventEmitterService).to(EventEmitterService).inSingletonScope();

clientContainer.bind(HttpService).to(HttpService).inRequestScope();

clientContainer
    .bind<Factory<HttpService>>(TYPES['Factory<HttpService>'])
    .toFactory((context: ResolutionContext) => {
        return (baseURL: string) => {
            return context.get(HttpService, { tag: { key: TYPES.baseURL, value: baseURL } });
        };
    });

clientContainer
    .bind<Factory<RestService>>(TYPES['Factory<RestService>'])
    .toFactory((context: ResolutionContext) => {
        return (baseURL: string) => {
            return context.get(RestService, { tag: { key: TYPES.baseURL, value: baseURL } });
        };
    });

export { clientContainer };
