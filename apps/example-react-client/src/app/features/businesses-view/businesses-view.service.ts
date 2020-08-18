import { Service } from '@libs/frontend/utils';
import { without, clone, contains } from 'ramda';
import { BusinessesViewStore } from './businesses-view.store';
import { BusinessesViewModel, ISearchQuery } from './businesses-view.model';
import { tap as rxTap } from 'rxjs/operators';
import Axios from 'axios-observable';
import { SELECTED_RATING, IHour12 } from '@libs/frontend/components';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';

@Service()
export class BusinessesViewService {
  constructor(private businessesViewStore: BusinessesViewStore) {}

  public setSearchString(searchString: string) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.searchString = searchString;
      return state;
    });
  }

  public selectOperatingCity(id: number) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedOperatingCityIds.push(id);
      return state;
    });
  }

  public deselectOperatingCity(id: number) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedOperatingCityIds = without(
        [id],
        state.selectedOperatingCityIds
      );
      return state;
    });
  }

  public selectWorkType(id: number) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedWorkTypeIds.push(id);
      return state;
    });
  }

  public deselectWorkType(id: number) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedWorkTypeIds = without([id], state.selectedWorkTypeIds);
      return state;
    });
  }

  public toggleSelectedAvgRating(selectedAvgRating: SELECTED_RATING) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      if (state.selectedAvgRating === selectedAvgRating) {
        state.selectedAvgRating = SELECTED_RATING.NONE;
      } else {
        state.selectedAvgRating = selectedAvgRating;
      }
      return state;
    });
  }

  public setSelectedBusinessOpenHour(selectedBusinessHour: IHour12) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedOpenHour = selectedBusinessHour;
      return state;
    });
  }

  public setSelectedBusinessCloseHour(selectedBusinessHour: IHour12) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      state.selectedCloseHour = selectedBusinessHour;
      return state;
    });
  }

  public toggleSelectedDayOfWeek(dayOfWeek: DAY_OF_WEEK) {
    this.businessesViewStore.update((_state: BusinessesViewModel) => {
      const state = clone(_state);
      if (contains(dayOfWeek, state.selectedDaysOfWeek)) {
        state.selectedDaysOfWeek = without(
          [dayOfWeek],
          state.selectedDaysOfWeek
        );
      } else {
        state.selectedDaysOfWeek.push(dayOfWeek);
      }
      return state;
    });
  }

  public search(searchQuery: ISearchQuery) {
    this.businessesViewStore.setLoading(true);
    return Axios.post('/api/search', searchQuery).pipe(
      rxTap((response) => {
        if (response.status === 201) {
          this.businessesViewStore.update((_state: BusinessesViewModel) => {
            const state = clone(_state);
            state.searchQueryResults = response.data;
            return state;
          });
        }
        this.businessesViewStore.setLoading(false);
      })
    );
  }
}
