import 'reflect-metadata';

import { Container, Factory, ResolutionContext } from 'inversify';

import { HttpService } from '@/common';

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

export { serverContainer };
