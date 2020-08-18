import 'reflect-metadata';
import { injectable, decorate } from 'inversify';
import { serviceContainer } from './service.container';

export function Service() {
  return (target: any) => {
    try {
      decorate(injectable(), target);
      serviceContainer.bind(target).toSelf().inSingletonScope();
    } catch (err) {
      console.error(err);
    }
    return target;
  };
}
