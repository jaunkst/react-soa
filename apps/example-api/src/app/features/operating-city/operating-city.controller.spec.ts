import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessOperationWindowService } from '../business-operation-window/business-operation-window.service';
import { BusinessReview } from '../business-review/business-review.entity';
import { BusinessReviewService } from '../business-review/business-review.service';
import { Business } from '../business/business.entity';
import { BusinessService } from '../business/business.service';
import { OperatingCityService } from '../operating-city/operating-city.service';
import { WorkType } from '../work-type/work-type.entity';
import { WorkTypeService } from '../work-type/work-type.service';
import { OperatingCityController } from './operating-city.controller';
import { OperatingCity } from './operating-city.entity';

describe('BusinessController', () => {
  let operatingCityController: OperatingCityController;
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
      controllers: [OperatingCityController],
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
    operatingCityController = moduleRef.get<OperatingCityController>(
      OperatingCityController
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

  describe('get, create, update, and delete operating cities', () => {
    let operatingCity;

    it('should list business operating cities', async () => {
      const operatingCities = await operatingCityController.getOperatingCities();
      expect(operatingCities.length).toBeGreaterThan(0);
    });

    it('should list business operation windows for business', async () => {
      const operatingCities = await operatingCityController.getOperatingCitiesForBusiness(
        { id: 1 }
      );
      expect(operatingCities.length).toBeGreaterThan(0);
    });

    it('should create an operating city', async () => {
      operatingCity = await operatingCityController.createOperatingCity({
        name: 'A New Operating City',
      });
      expect(operatingCity.id).not.toBeNull();
    });

    it('should update an operating city', async () => {
      await operatingCityController.updateOperatingCity(
        { id: operatingCity.id },
        {
          name: 'An Updated Operating City',
        }
      );
      const updatedOperatingCity: OperatingCity = await operatingCityService.findOne(
        operatingCity.id
      );
      expect(updatedOperatingCity.name).toBe('An Updated Operating City');
    });

    it('should assign an operating city to a business', async () => {
      await operatingCityController.assignOperatingCityToBusiness({
        businessId: 1,
        operatingCityId: operatingCity.id,
      });

      const count = await getRepository(OperatingCity)
        .createQueryBuilder('operatingCity')
        .leftJoinAndSelect('operatingCity.businesses', 'business')
        .where('operatingCity.id = :operatingCityId', {
          operatingCityId: operatingCity.id,
        })
        .andWhere('business.id = :businessId', { businessId: 1 })
        .getCount();

      expect(count).toBe(1);
    });

    it('should unassign an operating city to a business', async () => {
      await operatingCityController.unassignedOperatingCityToBusiness({
        businessId: 1,
        operatingCityId: operatingCity.id,
      });
      const count = await getRepository(OperatingCity)
        .createQueryBuilder('operatingCity')
        .leftJoinAndSelect('operatingCity.businesses', 'business')
        .where('operatingCity.id = :operatingCityId', {
          operatingCityId: operatingCity.id,
        })
        .andWhere('business.id = :businessId', { businessId: 1 })
        .getCount();

      expect(count).toBe(0);
    });

    it('should delete a business operation window', async () => {
      await operatingCityController.deleteOperatingCity({
        id: operatingCity.id,
      } as any);
      const deleted: OperatingCity = await operatingCityService.findOne(
        operatingCity.id
      );
      expect(deleted).toBeUndefined();
    });
  });
});
