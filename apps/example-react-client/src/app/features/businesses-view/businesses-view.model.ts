import { SELECTED_RATING, AM_PM, IHour12 } from '@libs/frontend/components';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';
import { IBusiness } from '@libs/isomorphic/models';

export interface BusinessesViewModel {
  searchString: string;
  selectedOperatingCityIds: number[];
  selectedWorkTypeIds: number[];
  searchQueryResults: ISearchQueryResults;
  selectedAvgRating: SELECTED_RATING;
  selectedOpenHour: IHour12;
  selectedCloseHour: IHour12;
  selectedDaysOfWeek: DAY_OF_WEEK[];
}

export interface ISearchQueryOperators {
  eq?: number;
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  not?: number;
}

export interface ISearchQuery {
  name?: string;
  businessHours?: {
    dayOfWeek?: number[];
    open?: ISearchQueryOperators;
    close?: ISearchQueryOperators;
  };
  avgRatingScore?: ISearchQueryOperators;
  workTypes?: number[];
  operatingCities?: number[];
  sortBy?: string;
  orderBy?: string;
  skip?: number;
  limit?: number;
}

export interface ISearchQueryResults {
  results: IBusiness[];
  skip: number;
  limit: number;
  count: number;
}

export interface BusinessHour {
  id: number;
  businessId: number;
  dayOfWeek: number;
  open: number;
  close: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperatingCity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  businessId: number;
  ratingScore: number;
  customerComment: null | string;
  createdAt: Date;
  updatedAt: Date;
}
