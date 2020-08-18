import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessOperationWindow } from '../business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../business-review/business-review.entity';
import { OperatingCity } from '../operating-city/operating-city.entity';
import { WorkType } from '../work-type/work-type.entity';
import { CreateBusinessDto } from './business.dto';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany('BusinessOperationWindow', 'business')
  businessHours: BusinessOperationWindow[];

  @OneToMany('BusinessReview', 'business')
  reviews: BusinessReview[];

  @ManyToMany('OperatingCity', 'businesses')
  @JoinTable()
  operatingCities!: OperatingCity[];

  @ManyToMany('WorkType', 'businesses')
  @JoinTable()
  workTypes!: WorkType[];

  @Column({ type: 'int', default: 0, nullable: true })
  avgRatingScore;

  @Column({ type: 'varchar', length: 128 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  addressLine2?: string | null;

  @Column({ type: 'varchar', length: 128 })
  city: string;

  @Column({ type: 'varchar', length: 128 })
  stateAbbr: string;

  @Column({ type: 'varchar', length: 128 })
  postal: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  constructor(createBusinessDto: CreateBusinessDto) {
    Object.assign(this, createBusinessDto);
  }
}
