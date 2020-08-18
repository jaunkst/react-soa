import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  Unique,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { CreateOperatingCityDto } from './operating-city.dto';

@Entity()
@Unique(['name'])
export class OperatingCity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany('Business', 'operatingCities')
  businesses: Business[];

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  constructor(createOperatingCityDto: CreateOperatingCityDto) {
    Object.assign(this, createOperatingCityDto);
  }
}
