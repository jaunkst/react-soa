import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  AfterInsert,
  getRepository,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { IsOptional } from 'class-validator';
import { CreateBusinessReviewDto } from './business-review.dto';

@Entity()
export class BusinessReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.businessHours, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column({ type: 'int', nullable: true })
  businessId: number;

  @Column({ type: 'int' })
  ratingScore: number;

  @IsOptional()
  @Column({ type: 'varchar', length: 128, nullable: true })
  customerComment?: string | null;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  constructor(createBusinessReviewDto: CreateBusinessReviewDto) {
    Object.assign(this, createBusinessReviewDto);
  }

  @AfterInsert()
  @AfterRemove()
  @AfterUpdate()
  async updateBusinessAvgRatingScore() {
    if (this.businessId) {
      const businessRepository = await getRepository(Business);
      const business = await businessRepository.findOne(this.businessId);
      const [{ avgRatingScore }] = await getRepository(BusinessReview)
        .createQueryBuilder('review')
        .select('ROUND(AVG(review.ratingScore))', 'avgRatingScore')
        .where('businessId = :businessId', { businessId: business.id })
        .execute();

      business.avgRatingScore = avgRatingScore;
      await businessRepository.save(business);
    }
  }
}
