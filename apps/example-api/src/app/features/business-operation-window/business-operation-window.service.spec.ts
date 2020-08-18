import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { BusinessService } from '../business/business.service';
import { BusinessOperationWindowService } from './business-operation-window.service';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateBusinessOperationWindowDto } from './business-operation-window.dto';
import { BusinessOperationWindow } from './business-operation-window.entity';
import { Business } from '../business/business.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';

describe('BusinessOperationWindowService', () => {
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
      controllers: [],
      providers: [BusinessService, BusinessOperationWindowService],
    }).compile();

    businessService = moduleRef.get<BusinessService>(BusinessService);

    businessOperationWindowService = moduleRef.get<
      BusinessOperationWindowService
    >(BusinessOperationWindowService);
  });

  describe('create', () => {
    it('should create a BusinessOperationWindow', async () => {
      const createBusinessReviewDto = await transformAndValidate(
        CreateBusinessOperationWindowDto,
        {
          dayOfWeek: DAY_OF_WEEK.SUN,
          open: 6,
          close: 9,
        }
      );

      const created = await businessOperationWindowService.create(
        createBusinessReviewDto
      );
      const found = await businessOperationWindowService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });

    it('should not create a BusinessOperationWindow if dayOfWeek is less than 0', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessOperationWindowDto,
          {
            dayOfWeek: -1,
            open: 6,
            close: 9,
          }
        );

        await businessOperationWindowService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('min');
      }
    });

    it('should not create a BusinessOperationWindow if dayOfWeek is not an integer', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessOperationWindowDto,
          {
            dayOfWeek: 'NOT_AN_INTEGER',
            open: 6,
            close: 9,
          }
        );

        await businessOperationWindowService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isInt');
      }
    });

    it('should not create a BusinessOperationWindow if open is not an integer', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessOperationWindowDto,
          {
            dayOfWeek: DAY_OF_WEEK.MON,
            open: 'NOT_AN_INTEGER',
            close: 9,
          }
        );

        await businessOperationWindowService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isInt');
      }
    });

    it('should not create a BusinessOperationWindow if close is not an integer', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessOperationWindowDto,
          {
            dayOfWeek: DAY_OF_WEEK.MON,
            open: 6,
            close: 'NOT_AN_INTEGER',
          }
        );

        await businessOperationWindowService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isInt');
      }
    });
  });

  describe('find', () => {
    it('should find a BusinessOperationWindow by id', async () => {
      const created = await businessOperationWindowService.create({
        dayOfWeek: DAY_OF_WEEK.SUN,
        open: 6,
        close: 9,
      });
      const found = await businessOperationWindowService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });

    it('should find a BusinessOperationWindow by businessId', async () => {
      const createdBusiness = await businessService.create({
        name: 'Example Business #1',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });

      const createdOperationWindow = await businessOperationWindowService.create(
        {
          businessId: createdBusiness.id,
          dayOfWeek: 0,
          open: 6,
          close: 9,
        }
      );

      const found = await businessOperationWindowService.findOne(
        createdOperationWindow.id,
        { relations: ['business'] }
      );

      expect(createdOperationWindow.id).toEqual(found.id);
    });
  });

  describe('update', () => {
    it('should update a BusinessOperationWindow', async () => {
      const createdBusiness = await businessService.create({
        name: 'Example Business #12',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });

      const createdBusinessOperationWIndow = await businessOperationWindowService.create(
        {
          businessId: createdBusiness.id,
          dayOfWeek: DAY_OF_WEEK.SUN,
          open: 6,
          close: 9,
        }
      );

      createdBusinessOperationWIndow.dayOfWeek = DAY_OF_WEEK.TUE;
      createdBusinessOperationWIndow.open = 3;
      createdBusinessOperationWIndow.close = 5;
      await businessOperationWindowService.update(
        createdBusinessOperationWIndow.id,
        createdBusinessOperationWIndow
      );

      const found = await businessOperationWindowService.findOne(
        createdBusinessOperationWIndow.id
      );
      expect(found.dayOfWeek).toEqual(DAY_OF_WEEK.TUE);
      expect(found.open).toEqual(3);
      expect(found.close).toEqual(5);
    });
  });

  describe('all', () => {
    it('should return an array of BusinessOperationWindow', async () => {
      const businessOperationWindows = await businessOperationWindowService.all();
      expect(businessOperationWindows.length).toBeGreaterThan(0);
    });
  });
});
