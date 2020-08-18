import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { CreateBusinessOperationWindowDto } from './business-operation-window.dto';

@Entity()
export class BusinessOperationWindow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.businessHours, {
    onDelete: 'CASCADE',
  })
  business: Business;

  @Column({ type: 'int', nullable: true })
  businessId: number;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'int' })
  open: number;

  @Column({ type: 'int' })
  close: number;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  constructor(params: CreateBusinessOperationWindowDto) {
    Object.assign(this, params);
  }
}
