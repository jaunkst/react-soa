import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { OperatingCity } from './operating-city.entity';
import { getRepository } from 'typeorm';
import { getConnection } from 'typeorm';

import {
  CreateOperatingCityDto,
  UpdateOperatingCityDto,
  AssignOperatingCityDto,
  UnassignOperatingCityDto,
} from './operating-city.dto';

@Injectable()
export class OperatingCityService {
  public async all() {
    return await getRepository(OperatingCity).find();
  }

  public async findOne(id: number) {
    return await getRepository(OperatingCity).findOne(id);
  }

  public async findByBusinessId(id: number) {
    return await getRepository(OperatingCity)
      .createQueryBuilder('operatingCity')
      .innerJoin('operatingCity.businesses', 'business')
      .where('business.id = :id', { id })
      .getMany();
  }

  public async assignBusiness(assignOperatingCityDto: AssignOperatingCityDto) {
    try {
      await getConnection()
        .createQueryBuilder()
        .relation(OperatingCity, 'businesses')
        .of(assignOperatingCityDto.operatingCityId)
        .add(assignOperatingCityDto.businessId);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }

  public async unassignBusiness(
    unassignOperatingCityDto: UnassignOperatingCityDto,
  ) {
    await getConnection()
      .createQueryBuilder()
      .relation(OperatingCity, 'businesses')
      .of(unassignOperatingCityDto.operatingCityId)
      .remove(unassignOperatingCityDto.businessId);
  }

  public async create(createOperatingCityDto: CreateOperatingCityDto) {
    try {
      return await getRepository(OperatingCity).save(
        new OperatingCity(createOperatingCityDto),
      );
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }

  public async update(
    id: number,
    updateOperatingCityDto: UpdateOperatingCityDto,
  ) {
    const operatingCity = await getRepository(OperatingCity).findOne(id);
    if (!operatingCity) throw new NotFoundException();

    getRepository(OperatingCity).merge(operatingCity, updateOperatingCityDto);

    try {
      return await getRepository(OperatingCity).save(operatingCity);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      return err;
    }
  }

  public async delete(id: number) {
    return await getRepository(OperatingCity).delete(id);
  }
}
