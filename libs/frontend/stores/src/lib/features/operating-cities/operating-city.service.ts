import Axios from 'axios-observable';
import {
  OperatingCityStore,
  OperatingCityStoreState,
} from './operating-city.store';
import { tap as rxTap } from 'rxjs/operators';
import { Service } from '@libs/frontend/utils';
import { without, clone } from 'ramda';

@Service()
export class OperatingCityService {
  constructor(private operatingCitiesStore: OperatingCityStore) {}

  public fetch() {
    this.operatingCitiesStore.setLoading(true);
    return Axios.get('/api/operatingCities')
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

  public selectOperatingCity(id: number) {
    this.operatingCitiesStore.update((_state: OperatingCityStoreState) => {
      const state = clone(_state);
      state.ui.operatingCities.push(id);
      return state;
    });
  }

  public deselectOperatingCity(id: number) {
    this.operatingCitiesStore.update((_state: OperatingCityStoreState) => {
      const state = clone(_state);
      state.ui.operatingCities = without([id], state.ui.operatingCities);
      return state;
    });
  }
}
