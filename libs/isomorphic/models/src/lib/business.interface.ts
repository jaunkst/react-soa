export interface IBusiness {
  id: number;
  avgRatingScore: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateAbbr: string;
  postal: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  businessHours: IBusinessHour[];
  reviews: IReview[];
  operatingCities: IOperatingCity[];
  workTypes: IOperatingCity[];
}

export interface IBusinessHour {
  id: number;
  businessId: number;
  dayOfWeek: number | string;
  open: number;
  close: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOperatingCity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  id: number;
  businessId: number;
  ratingScore: number;
  customerComment: string;
  createdAt: Date;
  updatedAt: Date;
}
