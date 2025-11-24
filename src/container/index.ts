import { isServer } from '@/utils';

import { clientContainer } from './client';
import { serverContainer } from './server';
import { TYPES } from './types';

function getContainer() {
    return isServer() ? serverContainer : clientContainer;
}

getContainer()
    .bind(TYPES.baseURL)
    .toConstantValue('https://jsonplaceholder.typicode.com')
    .whenParentTagged(TYPES.baseURL, 'https://jsonplaceholder.typicode.com');

export { getContainer };
