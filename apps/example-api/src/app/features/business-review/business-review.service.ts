import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessReview } from './business-review.entity';
import { getRepository } from 'typeorm';
import {
  CreateBusinessReviewDto,
  UpdateBusinessReviewDto,
} from './business-review.dto';

@Injectable()
export class BusinessReviewService {
  public async all() {
    return await getRepository(BusinessReview).find();
  }

  public async findOne(id: number) {
    return await getRepository(BusinessReview).findOne(id);
  }

  public async findByBusinessId(id: number) {
    return await getRepository(BusinessReview)
      .createQueryBuilder('businessReview')
      .where('businessReview.businessId = :id', { id })
      .getMany();
  }

  public async create(createBusinessReviewDto: CreateBusinessReviewDto) {
    const businessReview = new BusinessReview(createBusinessReviewDto);
    return await getRepository(BusinessReview).save(businessReview);
  }

  public async update(
    id: number,
    updateBusinessReviewDto: UpdateBusinessReviewDto,
  ) {
    const businessReview = await getRepository(BusinessReview).findOne(id);
    if (!businessReview) throw new NotFoundException();
    getRepository(BusinessReview).merge(
      businessReview,
      updateBusinessReviewDto,
    );
    return await getRepository(BusinessReview).save(businessReview);
  }

  public async delete(id: number) {
    const businessReview = await getRepository(BusinessReview).findOne(id);
    return await getRepository(BusinessReview)
      .remove(businessReview)
      .then(() => {
        return '';
      });
  }
}
