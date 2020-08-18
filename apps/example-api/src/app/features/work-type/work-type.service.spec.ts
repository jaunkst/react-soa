import { Test } from '@nestjs/testing';
import { WorkTypeController } from './work-type.controller';
import { WorkTypeService } from './work-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { WorkType } from './work-type.entity';
import { Business } from '../business/business.entity';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';

describe('WorkTypeService', () => {
  let workTypeService: WorkTypeService;

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
      providers: [WorkTypeService],
    }).compile();

    workTypeService = moduleRef.get<WorkTypeService>(WorkTypeService);
  });

  describe('create', () => {
    it('should create a WorkType', async () => {
      const created = await workTypeService.create({
        name: 'WorkType Example #1',
      });
      const found = await workTypeService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });
  });

  describe('findOne', () => {
    it('should find a WorkType by id', async () => {
      const created = await workTypeService.create({
        name: 'WorkType To Find',
      });
      const found = await workTypeService.findOne(created.id);
      expect(created.id).toEqual(found.id);
    });
  });

  describe('update', () => {
    it('should update a WorkType', async () => {
      const created = await workTypeService.create({
        name: 'WorkType Example #2',
      });
      await workTypeService.update(created.id, {
        name: 'WorkType Example #2 Updated',
      });
      const found = await workTypeService.findOne(created.id);
      expect(found.name).toEqual('WorkType Example #2 Updated');
    });
  });

  describe('all', () => {
    it('should return an array of WorkTypes', async () => {
      const workTypes = await workTypeService.all();
      expect(workTypes.length).toBeGreaterThan(0);
    });
  });

  describe('delete', () => {
    it('should delete a WorkType', async () => {
      const created = await workTypeService.create({
        name: 'WorkType Example #3',
      });
      await workTypeService.delete(created.id);
      const workType = await workTypeService.findOne(created.id);
      expect(workType).toBeUndefined();
    });
  });
});
