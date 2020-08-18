import { WorkTypeStore, WorkTypeStoreState } from './work-type.store';
import { WorkType } from './work-type.model';
import { QueryEntity } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';

@Service()
export class WorkTypeQuery extends QueryEntity<WorkTypeStoreState, WorkType> {
  constructor(protected store: WorkTypeStore) {
    super(store);
  }
}
