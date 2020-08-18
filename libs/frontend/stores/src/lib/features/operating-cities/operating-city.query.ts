import {
  OperatingCityStore,
  OperatingCityStoreState,
} from './operating-city.store';
import { OperatingCity } from './operating-city.model';
import { QueryEntity } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

@Service()
export class OperatingCityQuery extends QueryEntity<
  OperatingCityStoreState,
  OperatingCity
> {
  constructor(protected store: OperatingCityStore) {
    super(store);
  }
}
