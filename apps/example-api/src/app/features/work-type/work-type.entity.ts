import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToMany,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { CreateWorkTypeDto } from './work-type.dto';

@Entity()
@Unique(['name'])
export class WorkType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany('Business', 'workTypes')
  businesses: Business[];

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  constructor(createWorkTypeDto: CreateWorkTypeDto) {
    Object.assign(this, createWorkTypeDto);
  }
}
