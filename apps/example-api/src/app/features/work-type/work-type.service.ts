import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getRepository, getConnection } from 'typeorm';
import {
  CreateWorkTypeDto,
  AssignWorkTypeDto,
  UnassignWorkTypeDto,
  UpdateWorkTypeDto,
} from './work-type.dto';
import { WorkType } from './work-type.entity';
import { merge } from 'ramda';

@Injectable()
export class WorkTypeService {
  public async all() {
    return await getRepository(WorkType).find();
  }

  public async findOne(id: number) {
    return await getRepository(WorkType).findOne(id);
  }

  public async findByBusinessId(id: number) {
    return await getRepository(WorkType)
      .createQueryBuilder('workType')
      .innerJoin('workType.businesses', 'business')
      .where('business.id = :id', { id })
      .getMany();
  }

  public async delete(id: number) {
    return await getRepository(WorkType).delete(id);
  }

  public async assignBusiness(assignWorkTypeDto: AssignWorkTypeDto) {
    try {
      await getConnection()
        .createQueryBuilder()
        .relation(WorkType, 'businesses')
        .of(assignWorkTypeDto.workTypeId)
        .add(assignWorkTypeDto.businessId);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }

  public async unassignBusiness(unassignWorkTypeDto: UnassignWorkTypeDto) {
    await getConnection()
      .createQueryBuilder()
      .relation(WorkType, 'businesses')
      .of(unassignWorkTypeDto.workTypeId)
      .remove(unassignWorkTypeDto.businessId);
  }

  public async create(createWorkTypeDto: CreateWorkTypeDto) {
    try {
      return await getRepository(WorkType).save(
        new WorkType(createWorkTypeDto),
      );
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }

  public async update(id: number, updateWorkTypeDto: UpdateWorkTypeDto) {
    const operatingCity = await getRepository(WorkType).findOne(id);
    if (!operatingCity) throw new NotFoundException();

    try {
      return await getRepository(WorkType).save(
        merge(operatingCity, updateWorkTypeDto),
      );
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }
}
