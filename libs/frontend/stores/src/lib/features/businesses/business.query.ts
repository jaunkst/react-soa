import { BusinessStore, BusinessStoreState } from './business.store';
import { Business } from './business.model';
import { QueryEntity } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

@Service()
export class BusinessQuery extends QueryEntity<BusinessStoreState, Business> {
  constructor(protected store: BusinessStore) {
    super(store);
  }
}
