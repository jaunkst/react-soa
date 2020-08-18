import { Test } from '@nestjs/testing';
import { OperatingCityService } from './operating-city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';
import { CreateOperatingCityDto } from './operating-city.dto';
import { OperatingCity } from './operating-city.entity';
import { Business } from '../business/business.entity';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { WorkType } from '../work-type/work-type.entity';

describe('OperatingCityService', () => {
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
      providers: [OperatingCityService],
    }).compile();

    operatingCityService = moduleRef.get<OperatingCityService>(
      OperatingCityService
    );
  });

  describe('create', () => {
    it('should create a OperatingCity', async () => {
      const created = await operatingCityService.create({
        name: 'OperatingCity Example #1',
      });
      const found = await operatingCityService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });

    it('should not create a OperatingCity if name is not a string', async () => {
      expect.assertions(4);
      try {
        const createOperatingCityDto = await transformAndValidate(
          CreateOperatingCityDto,
          { name: 0 }
        );

        await operatingCityService.create(createOperatingCityDto);
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
    it('should find a OperatingCity by id', async () => {
      const created = await operatingCityService.create({
        name: 'OperatingCity To Find',
      });
      const found = await operatingCityService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });
  });

  describe('update', () => {
    it('should update a OperatingCity', async () => {
      const created = await operatingCityService.create({
        name: 'OperatingCity Example #2',
      });
      await operatingCityService.update(created.id, {
        name: 'OperatingCity Example #2 Updated',
      });
      const found = await operatingCityService.findOne(created.id);
      expect(found.name).toEqual('OperatingCity Example #2 Updated');
    });
  });

  describe('all', () => {
    it('should return an array of OperatingCitys', async () => {
      const workTypes = await operatingCityService.all();
      expect(workTypes.length).toBeGreaterThan(0);
    });
  });

  describe('delete', () => {
    it('should delete a OperatingCity', async () => {
      const created = await operatingCityService.create({
        name: 'OperatingCity Example #3',
      });
      await operatingCityService.delete(created.id);
      const workType = await operatingCityService.findOne(created.id);
      expect(workType).toBeUndefined();
    });
  });
});
