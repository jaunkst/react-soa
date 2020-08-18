import { Test } from '@nestjs/testing';
import { WorkTypeController } from './work-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { WorkTypeService } from '../work-type/work-type.service';
import { OperatingCityService } from '../operating-city/operating-city.service';
import { WorkType } from './work-type.entity';
import { getRepository } from 'typeorm';
import { BusinessReviewService } from '../business-review/business-review.service';
import { BusinessService } from '../business/business.service';
import { BusinessOperationWindowService } from '../business-operation-window/business-operation-window.service';
import { Business } from '../business/business.entity';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';

describe('BusinessController', () => {
  let workTypeController: WorkTypeController;
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
      controllers: [WorkTypeController],
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
    workTypeController = moduleRef.get<WorkTypeController>(WorkTypeController);

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

  describe('get, create, update, and delete work types', () => {
    let workType;

    it('should list business work types', async () => {
      const operatingCities = await workTypeController.getWorkTypes();
      expect(operatingCities.length).toBeGreaterThan(0);
    });

    it('should list business work types for a business', async () => {
      const operatingCities = await workTypeController.getWorkTypesForBusiness({
        id: 1,
      });
      expect(operatingCities.length).toBeGreaterThan(0);
    });

    it('should create a work type', async () => {
      workType = await workTypeController.createWorkType({
        name: 'A New WorkType',
      });
      expect(workType.id).not.toBeNull();
    });

    it('should update a work type', async () => {
      await workTypeController.updateWorkType(
        { id: workType.id },
        {
          name: 'An Updated WorkType',
        }
      );
      const updatedWorkType = await workTypeService.findOne(workType.id);
      expect(updatedWorkType.name).toBe('An Updated WorkType');
    });

    it('should assign a work type to a business', async () => {
      await workTypeController.assignWorkTypeToBusiness({
        businessId: 1,
        workTypeId: workType.id,
      });

      const count = await getRepository(WorkType)
        .createQueryBuilder('workType')
        .leftJoinAndSelect('workType.businesses', 'business')
        .where('workType.id = :workTypeId', {
          workTypeId: workType.id,
        })
        .andWhere('business.id = :businessId', { businessId: 1 })
        .getCount();

      expect(count).toBe(1);
    });

    it('should unassign a work type to a business', async () => {
      await workTypeController.unassignedWorkTypeToBusiness({
        businessId: 1,
        workTypeId: workType.id,
      });
      const count = await getRepository(WorkType)
        .createQueryBuilder('workType')
        .leftJoinAndSelect('workType.businesses', 'business')
        .where('workType.id = :workTypeId', {
          workTypeId: workType.id,
        })
        .andWhere('business.id = :businessId', { businessId: 1 })
        .getCount();

      expect(count).toBe(0);
    });

    it('should delete a work type', async () => {
      await workTypeController.deleteWorkType({
        id: workType.id,
      } as any);
      const deleted = await operatingCityService.findOne(workType.id);
      expect(deleted).toBeUndefined();
    });
  });
});
