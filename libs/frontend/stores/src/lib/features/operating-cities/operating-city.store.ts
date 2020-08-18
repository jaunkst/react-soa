import { OperatingCity } from './operating-city.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

export interface OperatingCityStoreState extends EntityState<OperatingCity> {}

@Service()
@StoreConfig({ name: 'operating-cities' })
export class OperatingCityStore extends EntityStore<
  OperatingCityStoreState,
  OperatingCity
> {
  constructor() {
    super();
  }
}
