import { Query } from '@datorama/akita';
import { Service } from '@libs/frontend/utils';
import { BusinessesViewModel, ISearchQuery } from './businesses-view.model';
import { BusinessesViewStore } from './businesses-view.store';
import { OperatingCityQuery, WorkTypeQuery } from '@libs/frontend/stores';
import {
  map as rxMap,
  debounceTime as rxDebounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { map, equals, isEmpty } from 'ramda';
import { combineLatest, Observable } from 'rxjs';
import { SELECTED_RATING, AM_PM, IHour12 } from '@libs/frontend/components';

@Service()
export class BusinessesViewQuery extends Query<BusinessesViewModel> {
  public searchString$ = this.select((state) => state.searchString);

  public operatingCityOptions$ = this.operatingCityQuery.selectAll().pipe(
    rxMap(
      map((operatingCity) => {
        return {
          id: operatingCity.id,
          label: operatingCity.name,
        };
      })
    )
  );

  public selectedOperatingCityIds$ = this.select(
    (state) => state.selectedOperatingCityIds
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public workTypeOptions$ = this.workTypeQuery.selectAll().pipe(
    rxMap(
      map((workType) => {
        return {
          id: workType.id,
          label: workType.name,
        };
      })
    )
  );

  public selectedWorkTypeIds$ = this.select(
    (state) => state.selectedWorkTypeIds
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public selectedAvgRating$ = this.select(
    (state) => state.selectedAvgRating
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public selectedDaysOfWeek$ = this.select(
    (state) => state.selectedDaysOfWeek
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public selectedOpenHour$ = this.select(
    (state) => state.selectedOpenHour
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public selectedCloseHour$ = this.select(
    (state) => state.selectedCloseHour
  ).pipe(distinctUntilChanged((a, b) => equals(a, b)));

  public searchQuery$: Observable<ISearchQuery> = combineLatest([
    this.searchString$.pipe(rxDebounceTime(300)),
    this.selectedOperatingCityIds$.pipe(rxDebounceTime(1000)),
    this.selectedWorkTypeIds$.pipe(rxDebounceTime(1000)),
    this.selectedAvgRating$,
    this.selectedDaysOfWeek$,
    this.selectedOpenHour$,
    this.selectedCloseHour$,
  ]).pipe(
    rxMap(
      ([
        name,
        operatingCities,
        workTypes,
        selectedAvgRating,
        selectedDaysOfWeek,
        selectedOpenHour,
        selectedCloseHour,
      ]: [string, number[], number[], number, number[], IHour12, IHour12]) => {
        let query: ISearchQuery = {};
        if (!isEmpty(name)) query.name = name;
        if (!isEmpty(operatingCities)) query.operatingCities = operatingCities;
        if (!isEmpty(workTypes)) query.workTypes = workTypes;
        if (selectedAvgRating !== SELECTED_RATING.NONE) {
          query.avgRatingScore = {
            gte: selectedAvgRating,
          };
        }

        query.businessHours = {
          open: { gte: this.convert12HourTo24Hour(selectedOpenHour) },
          close: { lte: this.convert12HourTo24Hour(selectedCloseHour) },
        };

        if (!isEmpty(selectedDaysOfWeek)) {
          query.businessHours.dayOfWeek = selectedDaysOfWeek;
        }

        return query;
      }
    )
  );

  public searchQueryJSON$ = this.searchQuery$.pipe(
    rxMap((searchQuery) => {
      return JSON.stringify(searchQuery, null, 2);
    })
  );

  public searchQueryResults$ = this.select((state) => state.searchQueryResults);

  constructor(
    protected store: BusinessesViewStore,
    protected operatingCityQuery: OperatingCityQuery,
    protected workTypeQuery: WorkTypeQuery
  ) {
    super(store);
  }

  private convert12HourTo24Hour(businessHour: { hour: number; amPm: AM_PM }) {
    let hour24 = businessHour.hour;
    if (businessHour.amPm === AM_PM.PM) {
      hour24 += 12;
    }
    return hour24;
  }
}
