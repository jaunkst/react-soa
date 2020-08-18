import { WorkType } from './work-type.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

export interface WorkTypeStoreState extends EntityState<WorkType> {}

@Service()
@StoreConfig({ name: 'work-types' })
export class WorkTypeStore extends EntityStore<WorkTypeStoreState, WorkType> {
  constructor() {
    super();
  }
}
