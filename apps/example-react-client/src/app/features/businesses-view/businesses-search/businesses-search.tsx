import React, { useEffect } from 'react';
import {
  Input,
  MultiSelect,
  MULTI_SELECT_ACTION,
  ButtonGroup,
  Hour24Select,
  IMultiSelectOption,
  SELECTED_RATING,
  AM_PM,
  IHour12,
} from '@libs/frontend/components';
import { cond, equals } from 'ramda';
import { BusinessesViewQuery, BusinessesViewService } from '..';
import { useService } from '@libs/frontend/utils';
import {
  BusinessService,
  OperatingCityService,
  WorkTypeService,
} from '@libs/frontend/stores';
import { useObservable } from 'rxjs-hooks';
import { Subject } from 'rxjs';
import {
  switchMap as rxSwitchMap,
  takeUntil as rxTakeUntil,
} from 'rxjs/operators';
import { RatingFilter } from './rating-filter/rating-filter';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';

export const BusinesseSearch: React.FC = () => {
  const [
    businessesViewQuery,
    businessesViewService,
    businessService,
    operatingCityService,
    workTypeService,
  ] = [
    useService(BusinessesViewQuery),
    useService(BusinessesViewService),
    useService(BusinessService),
    useService(OperatingCityService),
    useService(WorkTypeService),
  ];

  const operatingCityOptions = useObservable<IMultiSelectOption[]>(
    () => businessesViewQuery.operatingCityOptions$,
    []
  );

  const selectedOperatingCityIds = useObservable<number[]>(
    () => businessesViewQuery.selectedOperatingCityIds$,
    []
  );

  const workTypeOptions = useObservable<IMultiSelectOption[]>(
    () => businessesViewQuery.workTypeOptions$,
    []
  );

  const selectedWorkTypeIds = useObservable<number[]>(
    () => businessesViewQuery.select((state) => state.selectedWorkTypeIds),
    []
  );

  const selectedAvgRating = useObservable<SELECTED_RATING>(
    () => businessesViewQuery.select((state) => state.selectedAvgRating),
    SELECTED_RATING.NONE
  );

  const selectedDaysOfWeek = useObservable<DAY_OF_WEEK[]>(
    () => businessesViewQuery.selectedDaysOfWeek$,
    []
  );

  const selectedOpenHour = useObservable<IHour12>(
    () => businessesViewQuery.selectedOpenHour$,
    {
      hour: 9,
      amPm: AM_PM.AM,
    }
  );

  const selectedCloseHour = useObservable<IHour12>(
    () => businessesViewQuery.selectedCloseHour$,
    {
      hour: 5,
      amPm: AM_PM.PM,
    }
  );

  useEffect(() => {
    const destroyed$ = new Subject();
    businessService.fetch();
    operatingCityService.fetch();
    workTypeService.fetch();

    businessesViewQuery.searchQuery$
      .pipe(
        rxTakeUntil(destroyed$),
        rxSwitchMap((searchQuery) => {
          return businessesViewService.search(searchQuery);
        })
      )
      .subscribe();

    return () => {
      destroyed$.next();
      destroyed$.complete();
    };
  }, []);

  return (
    <div className="space-y-8 p-8">
      <Input
        label="Search Business Name"
        onChange={(searchString) => {
          businessesViewService.setSearchString(searchString);
        }}
      />
      <MultiSelect
        label="Operating Cities"
        selectedIds={selectedOperatingCityIds}
        options={operatingCityOptions}
        onAction={cond([
          [
            equals(MULTI_SELECT_ACTION.ADD_ITEM),
            (_, id) => {
              businessesViewService.selectOperatingCity(id);
            },
          ],
          [
            equals(MULTI_SELECT_ACTION.REMOVE_ITEM),
            (_, id) => {
              businessesViewService.deselectOperatingCity(id);
            },
          ],
        ])}
      />

      <MultiSelect
        label="Services"
        selectedIds={selectedWorkTypeIds}
        options={workTypeOptions}
        onAction={cond([
          [
            equals(MULTI_SELECT_ACTION.ADD_ITEM),
            (_, id) => {
              businessesViewService.selectWorkType(id);
            },
          ],
          [
            equals(MULTI_SELECT_ACTION.REMOVE_ITEM),
            (_, id) => {
              businessesViewService.deselectWorkType(id);
            },
          ],
        ])}
      />

      <ButtonGroup
        label="Days of Week"
        options={[
          { id: DAY_OF_WEEK.SUN, label: 'S' },
          { id: DAY_OF_WEEK.MON, label: 'M' },
          { id: DAY_OF_WEEK.TUE, label: 'T' },
          { id: DAY_OF_WEEK.WED, label: 'W' },
          { id: DAY_OF_WEEK.THU, label: 'T' },
          { id: DAY_OF_WEEK.FRI, label: 'F' },
          { id: DAY_OF_WEEK.SAT, label: 'S' },
        ]}
        selectedOptions={selectedDaysOfWeek}
        onClick={(dayOfWeek: DAY_OF_WEEK) => {
          businessesViewService.toggleSelectedDayOfWeek(dayOfWeek);
        }}
      ></ButtonGroup>

      <div className="flex flex-row space-x-2">
        <Hour24Select
          hourOption={selectedOpenHour}
          label="Open"
          onSelect={(businessHour) => {
            businessesViewService.setSelectedBusinessOpenHour(businessHour);
          }}
        ></Hour24Select>

        <Hour24Select
          hourOption={selectedCloseHour}
          label="Close"
          onSelect={(businessHour) => {
            businessesViewService.setSelectedBusinessCloseHour(businessHour);
          }}
        ></Hour24Select>
      </div>

      <RatingFilter
        label="Avg. Customer Review"
        selectedRaiting={selectedAvgRating}
        onRatingClick={(selectedRating) => {
          businessesViewService.toggleSelectedAvgRating(selectedRating);
        }}
      ></RatingFilter>
    </div>
  );
};
