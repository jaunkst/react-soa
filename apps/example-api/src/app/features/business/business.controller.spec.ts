import { Test } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { QueryBusinessDto, VALID_BUSINESS_QUERY_SORT_BY } from './business.dto';
import { Business } from './business.entity';
import { head } from 'ramda';
import { ORDER_BY } from '@libs/backend/utils';

import { WorkTypeService } from '../work-type/work-type.service';
import { OperatingCityService } from '../operating-city/operating-city.service';
import { BusinessReviewService } from '../business-review/business-review.service';
import { BusinessOperationWindowService } from '../business-operation-window/business-operation-window.service';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';

describe('BusinessController', () => {
  let businessController: BusinessController;
  let businessService: BusinessService;
  let businessReviewService: BusinessReviewService;
  let businessOperationWindowService: BusinessOperationWindowService;
  let workTypeService: WorkTypeService;
  let operatingCityService: OperatingCityService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            Business,
            BusinessOperationWindow,
            BusinessReview,
            OperatingCity,
            WorkType,
          ],
          dropSchema: true,
          synchronize: true,
          logging: false,
        }),
      ],
      controllers: [BusinessController],
      providers: [
        BusinessService,
        BusinessReviewService,
        BusinessOperationWindowService,
        WorkTypeService,
        OperatingCityService,
      ],
    }).compile();

    businessOperationWindowService = moduleRef.get<
      BusinessOperationWindowService
    >(BusinessOperationWindowService);

    businessReviewService = moduleRef.get<BusinessReviewService>(
      BusinessReviewService
    );

    workTypeService = moduleRef.get<WorkTypeService>(WorkTypeService);
    operatingCityService = moduleRef.get<OperatingCityService>(
      OperatingCityService
    );
    businessService = moduleRef.get<BusinessService>(BusinessService);
    businessController = moduleRef.get<BusinessController>(BusinessController);

    for (const name of [
      'WorkType Example A',
      'WorkType Example B',
      'WorkType Example C',
    ]) {
      await workTypeService.create({ name });
    }

    for (const name of [
      'OperatingCity Example A',
      'OperatingCity Example B',
      'OperatingCity Example C',
    ]) {
      await operatingCityService.create({ name });
    }

    const businessSeed = [
      {
        name: 'Alpha',
        ratingScore: 4,
        dayOfWeek: 0,
        open: 0,
        close: 12,
        workTypes: [1],
        operatingCities: [1],
      },
      {
        name: 'Beta',
        ratingScore: 3,
        dayOfWeek: 0,
        open: 1,
        close: 13,
        workTypes: [1, 3],
        operatingCities: [2],
      },
      {
        name: 'Charlie',
        ratingScore: 2,
        dayOfWeek: 1,
        open: 2,
        close: 14,
        workTypes: [2],
        operatingCities: [1, 3],
      },
      {
        name: 'Delta',
        ratingScore: 1,
        dayOfWeek: 2,
        open: 3,
        close: 15,
        workTypes: [1, 3],
        operatingCities: [1],
      },
    ];

    for (const {
      name,
      ratingScore,
      dayOfWeek,
      open,
      close,
      workTypes,
      operatingCities,
    } of businessSeed) {
      const business = await businessService.create({
        name,
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });

      for (const workTypeId of workTypes) {
        workTypeService.assignBusiness({
          businessId: business.id,
          workTypeId,
        });
      }

      for (const operatingCityId of operatingCities) {
        operatingCityService.assignBusiness({
          businessId: business.id,
          operatingCityId,
        });
      }

      await businessReviewService.create({
        businessId: business.id,
        ratingScore,
      });

      await businessOperationWindowService.create({
        businessId: business.id,
        dayOfWeek,
        open,
        close,
      });
    }
  });

  describe('create, update, and delete a business', () => {
    let business: Business = null;
    it('should create a business', async () => {
      business = await businessController.createBusiness({
        addressLine1: 'Some Address',
        city: 'Random City',
        name: 'Business Z',
        postal: '70130',
        stateAbbr: 'RC',
      });
      expect(business.id).not.toBeNull();
    });

    it('should update a business', async () => {
      await businessController.updateBusiness(
        { id: business.id },
        {
          name: 'Renamed City',
        }
      );
      const updatedBusiness: Business = await businessService.findOne(
        business.id
      );
      expect(updatedBusiness.name).toBe('Renamed City');
    });

    it('should delete a business', async () => {
      await businessController.deleteBusiness({ id: business.id } as any);
      const deleted: Business = await businessService.findOne(business.id);
      expect(deleted).toBeUndefined();
    });
  });

  describe('query results should be sorted', () => {
    it('should return an array sorted by name ASC', async () => {
      const query: QueryBusinessDto = {
        sortBy: VALID_BUSINESS_QUERY_SORT_BY.NAME,
        orderBy: ORDER_BY.ASC,
      };
      const { results } = await businessController.searchBusinesess(query);
      const firstBusiness: Business = head(results);
      expect(firstBusiness.name).toEqual('Alpha');
    });

    it('should return an array sorted by name DESC', async () => {
      const query: QueryBusinessDto = {
        sortBy: VALID_BUSINESS_QUERY_SORT_BY.NAME,
        orderBy: ORDER_BY.DESC,
      };
      const { results } = await businessController.searchBusinesess(query);
      const firstBusiness: Business = head(results);
      expect(firstBusiness.name).toEqual('Delta');
    });

    it('should return an array sorted by avgRatingScore ASC', async () => {
      const query: QueryBusinessDto = {
        sortBy: VALID_BUSINESS_QUERY_SORT_BY.AVG_RATING_SCORE,
        orderBy: ORDER_BY.ASC,
      };
      const { results } = await businessController.searchBusinesess(query);
      const firstBusiness: Business = head(results);
      expect(firstBusiness.avgRatingScore).toEqual(1);
    });

    it('should return an array sorted by avgRatingScore DESC', async () => {
      const query: QueryBusinessDto = {
        sortBy: VALID_BUSINESS_QUERY_SORT_BY.AVG_RATING_SCORE,
        orderBy: ORDER_BY.DESC,
      };
      const { results } = await businessController.searchBusinesess(query);
      const firstBusiness: Business = head(results);
      expect(firstBusiness.avgRatingScore).toEqual(4);
    });
  });

  describe('query results should be filtered', () => {
    it('should be fildered by name', async () => {
      const query: QueryBusinessDto = { name: 'Charl' };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Charlie');
    });

    it('should be filtered by business hours', async () => {
      const query: QueryBusinessDto = {
        businessHours: {
          dayOfWeek: { eq: 0 },
          open: { eq: 1 },
          close: { eq: 13 },
        },
      };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Beta');
    });

    it('should be filtered by business hours', async () => {
      const query: QueryBusinessDto = {
        businessHours: {
          dayOfWeek: { eq: 0 },
          open: { eq: 1 },
          close: { eq: 13 },
        },
      };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Beta');
    });

    it('should be filtered by jobs', async () => {
      const query: QueryBusinessDto = {
        workTypes: [2],
      };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Charlie');
    });

    it('should be filtered by location', async () => {
      const query: QueryBusinessDto = {
        operatingCities: [2],
      };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Beta');
    });

    it('should be filtered by avg review score', async () => {
      const query: QueryBusinessDto = {
        avgRatingScore: { eq: 4 },
      };
      const { results } = await businessController.searchBusinesess(query);
      expect(head(results).name).toBe('Alpha');
    });
  });
});
