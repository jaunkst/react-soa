import { BusinessesViewModel } from './businesses-view.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';
import { AM_PM } from '@libs/frontend/components';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';

@Service()
@StoreConfig({ name: 'businesses-view' })
export class BusinessesViewStore extends Store<BusinessesViewModel> {
  constructor() {
    super({
      searchString: '',
      selectedOperatingCityIds: [],
      selectedWorkTypeIds: [],
      searchQueryResults: {
        count: 0,
        limit: 10,
        results: [],
        skip: 0,
      },
      selectedDaysOfWeek: [],
      selectedOpenHour: {
        hour: 9,
        amPm: AM_PM.AM,
      },
      selectedCloseHour: {
        hour: 5,
        amPm: AM_PM.PM,
      },
    });
  }
}
