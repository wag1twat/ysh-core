import { Container } from 'inversify';

import { EventEmitterService } from './services/event-emmiter/service';

const container = new Container();

container.bind(EventEmitterService).to(EventEmitterService).inSingletonScope();

export { container };
