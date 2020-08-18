import { Test } from '@nestjs/testing';
import { BusinessReviewController } from './business-review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTypeService } from '../work-type/work-type.service';
import { OperatingCityService } from '../operating-city/operating-city.service';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';
import { BusinessReviewService } from './business-review.service';
import { BusinessService } from '../business/business.service';
import { BusinessOperationWindowService } from '../business-operation-window/business-operation-window.service';
import { Business } from '../business/business.entity';
import { BusinessReview } from './business-review.entity';

describe('BusinessController', () => {
  let businessReviewController: BusinessReviewController;
  let businessReviewService: BusinessReviewService;
  let workTypeService: WorkTypeService;
  let operatingCityService: OperatingCityService;
  let businessService: BusinessService;
  let businessOperationWindowService: BusinessOperationWindowService;

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
      controllers: [BusinessReviewController],
      providers: [
        BusinessService,
        BusinessReviewService,
        BusinessReviewService,
        WorkTypeService,
        OperatingCityService,
        BusinessOperationWindowService,
        BusinessOperationWindowService,
      ],
    }).compile();

    businessReviewService = moduleRef.get<BusinessReviewService>(
      BusinessReviewService
    );

    businessOperationWindowService = moduleRef.get<
      BusinessOperationWindowService
    >(BusinessOperationWindowService);

    workTypeService = moduleRef.get<WorkTypeService>(WorkTypeService);
    operatingCityService = moduleRef.get<OperatingCityService>(
      OperatingCityService
    );
    businessService = moduleRef.get<BusinessService>(BusinessService);
    businessReviewController = moduleRef.get<BusinessReviewController>(
      BusinessReviewController
    );

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

  describe('get, create, update, and delete a businesses', () => {
    let businessReview;

    it('should list reviews', async () => {
      const businessReviews = await businessReviewController.getBusinessReviews();
      expect(businessReviews.length).toBeGreaterThan(0);
    });

    it('should list reviews for business', async () => {
      const businessReviews = await businessReviewController.getReviewsForBusiness(
        { id: 1 }
      );
      expect(businessReviews.length).toBeGreaterThan(0);
    });

    it('should create a review for a business', async () => {
      const business: Business = await businessService.findOne(1);
      businessReview = await businessReviewController.createReviewForBusiness(
        { id: business.id },
        {
          ratingScore: 3,
          customerComment: 'hello comment',
        }
      );
      expect(businessReview.id).not.toBeNull();
    });

    it('should update a review for a business', async () => {
      await businessReviewController.updateReviewForBusiness(
        { id: businessReview.id },
        {
          ratingScore: 2,
        }
      );
      const updatedBusinessReview: BusinessReview = await businessReviewService.findOne(
        businessReview.id
      );
      expect(updatedBusinessReview.ratingScore).toBe(2);
    });

    it('should delete a review for a business', async () => {
      await businessReviewController.deleteReviewForBusiness({
        id: businessReview.id,
      } as any);
      const deleted: Business = await businessService.findOne(
        businessReview.id
      );
      expect(deleted).toBeUndefined();
    });
  });
});
