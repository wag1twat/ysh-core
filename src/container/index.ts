import { isServer } from '@/utils';

import { clientContainer } from './client';
import { serverContainer } from './server';

function getContainer() {
    return isServer() ? serverContainer : clientContainer;
}

export { getContainer };
