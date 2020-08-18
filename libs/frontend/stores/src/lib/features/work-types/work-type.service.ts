import Axios from 'axios-observable';
import { WorkTypeStore, WorkTypeStoreState } from './work-type.store';
import { tap as rxTap } from 'rxjs/operators';
import { Service } from '@libs/frontend/utils';
import { without, clone } from 'ramda';

@Service()
export class WorkTypeService {
  constructor(private operatingCitiesStore: WorkTypeStore) {}

  public fetch() {
    this.operatingCitiesStore.setLoading(true);
    return Axios.get('/api/workTypes')
      .pipe(
        rxTap((response) => {
          if (response.status === 200) {
            this.operatingCitiesStore.set(response.data);
          }
          this.operatingCitiesStore.setLoading(false);
        })
      )
      .subscribe();
  }

  public selectWorkType(id: number) {
    this.operatingCitiesStore.update((_state: WorkTypeStoreState) => {
      const state = clone(_state);
      state.ui.selectedWorkTypeIds.push(id);
      return state;
    });
  }

  public deselectWorkType(id: number) {
    this.operatingCitiesStore.update((_state: WorkTypeStoreState) => {
      const state = clone(_state);
      state.ui.selectedWorkTypeIds = without(
        [id],
        state.ui.selectedWorkTypeIds
      );
      return state;
    });
  }
}
