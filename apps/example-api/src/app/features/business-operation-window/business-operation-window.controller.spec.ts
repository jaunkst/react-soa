import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatingCityService } from '../operating-city/operating-city.service';
import { WorkTypeService } from '../work-type/work-type.service';
import { BusinessOperationWindowController } from './business-operation-window.controller';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';
import { BusinessOperationWindowService } from './business-operation-window.service';
import { BusinessReviewService } from '../business-review/business-review.service';
import { BusinessService } from '../business/business.service';
import { Business } from '../business/business.entity';
import { BusinessOperationWindow } from './business-operation-window.entity';

describe('BusinessController', () => {
  let businessOperationWindowController: BusinessOperationWindowController;
  let businessOperationWindowService: BusinessOperationWindowService;
  let businessReviewService: BusinessReviewService;
  let workTypeService: WorkTypeService;
  let operatingCityService: OperatingCityService;
  let businessService: BusinessService;

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
      controllers: [BusinessOperationWindowController],
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
    businessOperationWindowController = moduleRef.get<
      BusinessOperationWindowController
    >(BusinessOperationWindowController);

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
    let businessOperationWindow;

    it('should list business operation windows', async () => {
      const operationWindows = await businessOperationWindowController.getHours();
      expect(operationWindows.length).toBeGreaterThan(0);
    });

    it('should list business operation windows for business', async () => {
      const operationWindows = await businessOperationWindowController.getHoursForBusiness(
        { id: 1 }
      );
      expect(operationWindows.length).toBeGreaterThan(0);
    });

    it('should create a business operation window', async () => {
      const business: Business = await businessService.findOne(1);
      businessOperationWindow = await businessOperationWindowController.createHoursForBusiness(
        { id: business.id },
        {
          dayOfWeek: 0,
          open: 1,
          close: 2,
        }
      );
      expect(businessOperationWindow.id).not.toBeNull();
    });

    it('should update a business operation window', async () => {
      await businessOperationWindowController.updateHoursForBusiness(
        { id: businessOperationWindow.id },
        {
          dayOfWeek: 3,
        }
      );
      const updatedBusinessOperationWindow: BusinessOperationWindow = await businessOperationWindowService.findOne(
        businessOperationWindow.id
      );
      expect(updatedBusinessOperationWindow.dayOfWeek).toBe(3);
    });

    it('should delete a business operation window', async () => {
      await businessOperationWindowController.deleteHoursForBusiness({
        id: businessOperationWindow.id,
      } as any);
      const deleted: Business = await businessService.findOne(
        businessOperationWindow.id
      );
      expect(deleted).toBeUndefined();
    });
  });
});
