import { Test } from '@nestjs/testing';
import { BusinessReviewService } from './business-review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ValidationError } from 'class-validator';
import { CreateBusinessReviewDto } from './business-review.dto';
import { transformAndValidate } from 'class-transformer-validator';
import { BusinessReview } from './business-review.entity';
import { Business } from '../business/business.entity';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';

describe('BusinessReviewService', () => {
  let businessReviewService: BusinessReviewService;

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
      providers: [BusinessReviewService],
    }).compile();

    businessReviewService = moduleRef.get<BusinessReviewService>(
      BusinessReviewService
    );
  });

  describe('create', () => {
    it('should create a BusinessReview', async () => {
      const created = await businessReviewService.create({
        ratingScore: 5,
        customerComment: 'Customer Comment #1',
      });
      const found = await businessReviewService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });

    it('should not create a BusinessReview if ratingScore is less than 0', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessReviewDto,
          {
            ratingScore: -1,
            customerComment: 'Customer Comment #2',
          }
        );

        await businessReviewService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('min');
      }
    });

    it('should not create a BusinessReview if ratingScore is greater than 5', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessReviewDto,
          {
            ratingScore: 6,
            customerComment: 'Customer Comment #3',
          }
        );

        await businessReviewService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('max');
      }
    });

    it('should not create a BusinessReview if ratingScore is not a number', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessReviewDto,
          {
            ratingScore: 'NOT_A_NUMBER',
            customerComment: 'Customer Comment #3',
          }
        );

        await businessReviewService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isInt');
      }
    });

    it('should not create a BusinessReview if customerComment is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessReviewDto,
          {
            ratingScore: 0,
            customerComment: 123123,
          }
        );

        await businessReviewService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });
  });

  describe('findOne', () => {
    it('should find a BusinessReview by id', async () => {
      const created = await businessReviewService.create({ ratingScore: 1 });
      const found = await businessReviewService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });
  });

  describe('update', () => {
    it('should update a BusinessReview', async () => {
      const created = await businessReviewService.create({ ratingScore: 2 });
      await businessReviewService.update(created.id, {
        ratingScore: 3,
        customerComment: 'Customer Comment',
      });
      const found = await businessReviewService.findOne(created.id);
      expect(found.ratingScore).toEqual(3);
      expect(found.customerComment).toEqual('Customer Comment');
    });
  });

  describe('all', () => {
    it('should return an array of BusinessReview', async () => {
      const workTypes = await businessReviewService.all();
      expect(workTypes.length).toBeGreaterThan(0);
    });
  });

  describe('delete', () => {
    it('should delete a BusinessReview', async () => {
      const created = await businessReviewService.create({ ratingScore: 0 });
      await businessReviewService.delete(created.id);
      const businessReview = await businessReviewService.findOne(created.id);
      expect(businessReview).toBeUndefined();
    });
  });
});
