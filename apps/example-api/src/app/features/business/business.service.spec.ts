import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { BusinessService } from '../../features/business/business.service';
import { CreateBusinessDto } from './business.dto';
import { transformAndValidate } from 'class-transformer-validator';
import { Business } from './business.entity';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';
import { BusinessReviewService } from '../business-review/business-review.service';

describe('BusinessService', () => {
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
      controllers: [],
      providers: [BusinessService, BusinessReviewService],
    }).compile();

    businessService = moduleRef.get<BusinessService>(BusinessService);
  });

  describe('create', () => {
    it('should create a Business', async () => {
      const createBusinessReviewDto = await transformAndValidate(
        CreateBusinessDto,
        {
          name: 'Example Business #1',
          addressLine1: '419 Some Address',
          addressLine2: '#404',
          city: 'New Orleans',
          stateAbbr: 'LA',
          postal: '70130',
        }
      );

      const created = await businessService.create(createBusinessReviewDto);
      const found = await businessService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });

    it('should not create a Business if name is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 1,
            addressLine1: '419 Some Address',
            addressLine2: '#404',
            city: 'New Orleans',
            stateAbbr: 'LA',
            postal: '70130',
          }
        );

        await businessService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should not create a Business if addressLine1 is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 'Example Business #2',
            addressLine1: 1,
            addressLine2: '#404',
            city: 'New Orleans',
            stateAbbr: 'LA',
            postal: '70130',
          }
        );

        await businessService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should not create a Business if addressLine2 is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 'Example Business #2',
            addressLine1: '419 Some Address',
            addressLine2: 1,
            city: 'New Orleans',
            stateAbbr: 'LA',
            postal: '70130',
          }
        );

        await businessService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should not create a Business if city is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 'Example Business #2',
            addressLine1: '419 Some Address',
            addressLine2: '#404',
            city: 1,
            stateAbbr: 'LA',
            postal: '70130',
          }
        );

        await businessService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should not create a Business if stateAbbr is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 'Example Business #2',
            addressLine1: '419 Some Address',
            addressLine2: '#404',
            city: 'New Orleans',
            stateAbbr: 1,
            postal: '70130',
          }
        );

        await businessService.create(createBusinessReviewDto);
      } catch (e) {
        const errors = e as ValidationError[];
        expect(errors).toBeDefined();
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toHaveProperty('constraints');
        expect(errors[0].constraints).toHaveProperty('isString');
      }
    });

    it('should not create a Business if postal is not a string', async () => {
      expect.assertions(4);
      try {
        const createBusinessReviewDto = await transformAndValidate(
          CreateBusinessDto,
          {
            name: 'Example Business #2',
            addressLine1: '419 Some Address',
            addressLine2: '#404',
            city: 'New Orleans',
            stateAbbr: 'LA',
            postal: 1,
          }
        );

        await businessService.create(createBusinessReviewDto);
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
    it('should find a Business by id', async () => {
      const created = await businessService.create({
        name: 'Example Business #1',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });
      const found = await businessService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });
  });

  describe('update', () => {
    it('should update a Business', async () => {
      const created = await businessService.create({
        name: 'Example Business #3',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });
      await businessService.update(created.id, {
        name: 'Example Business #4',
        addressLine1: '500 Another Address',
        city: 'Aspen',
        stateAbbr: 'CO',
        postal: '81611',
      });
      const found = await businessService.findOne(created.id);
      expect(found.name).toEqual('Example Business #4');
      expect(found.addressLine1).toEqual('500 Another Address');
      expect(found.addressLine2).toEqual('#404');
      expect(found.city).toEqual('Aspen');
      expect(found.stateAbbr).toEqual('CO');
      expect(found.postal).toEqual('81611');
    });
  });

  describe('delete', () => {
    it('should delete a Business', async () => {
      const created = await businessService.create({
        name: 'Example Business #1',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });
      await businessService.delete(created.id);
      const businessReview = await businessService.findOne(created.id);
      expect(businessReview).toBeUndefined();
    });

    it('should cascade delete relations', async () => {
      const created = await businessService.create({
        name: 'Example Business #1',
        addressLine1: '419 Some Address',
        addressLine2: '#404',
        city: 'New Orleans',
        stateAbbr: 'LA',
        postal: '70130',
      });

      await businessService.delete(created.id);
    });
  });
});
