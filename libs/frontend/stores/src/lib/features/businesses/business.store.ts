import { Business } from './business.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

export interface BusinessStoreState extends EntityState<Business> {}

@Service()
@StoreConfig({ name: 'businesses' })
export class BusinessStore extends EntityStore<BusinessStoreState, Business> {
  constructor() {
    super();
  }
}
