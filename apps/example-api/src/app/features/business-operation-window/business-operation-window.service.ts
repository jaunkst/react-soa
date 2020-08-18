import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, getRepository } from 'typeorm';
import {
  CreateBusinessOperationWindowDto,
  UpdateBusinessOperationWindowDto,
} from './business-operation-window.dto';
import { BusinessOperationWindow } from './business-operation-window.entity';

@Injectable()
export class BusinessOperationWindowService {
  public async all() {
    return await getRepository(BusinessOperationWindow).find();
  }

  public async findOne(
    id: number,
    options?: FindOneOptions<BusinessOperationWindow>,
  ) {
    return await getRepository(BusinessOperationWindow).findOne(id, options);
  }

  public async findByBusinessId(id: number) {
    return await getRepository(BusinessOperationWindow)
      .createQueryBuilder('businessOperationWindow')
      .where('businessOperationWindow.businessId = :id', { id })
      .getMany();
  }

  public async create(
    createBusinessOperationsWindowDto: CreateBusinessOperationWindowDto,
  ) {
    return await getRepository(BusinessOperationWindow).save(
      createBusinessOperationsWindowDto,
    );
  }

  public async update(
    id: number,
    updateBusinessOperationsWindowDto: UpdateBusinessOperationWindowDto,
  ) {
    const businessOperationWindow = await getRepository(
      BusinessOperationWindow,
    ).findOne(id);
    if (!businessOperationWindow) throw new NotFoundException();
    getRepository(BusinessOperationWindow).merge(
      businessOperationWindow,
      updateBusinessOperationsWindowDto,
    );
    return await getRepository(BusinessOperationWindow).save(
      businessOperationWindow,
    );
  }

  public async delete(id: number) {
    return await getRepository(BusinessOperationWindow)
      .delete(id)
      .then(() => {
        return '';
      });
  }
}
