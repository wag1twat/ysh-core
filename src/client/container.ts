import { Container } from 'inversify';

import { EventEmitterService } from './services';

const container = new Container();

container.bind(EventEmitterService).to(EventEmitterService).inSingletonScope();

export { container };
