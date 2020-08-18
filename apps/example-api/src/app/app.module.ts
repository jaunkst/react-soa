import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTypeController } from './features/work-type/work-type.controller';
import { WorkTypeService } from './features/work-type/work-type.service';
import { OperatingCityController } from './features/operating-city/operating-city.controller';
import { OperatingCityService } from './features/operating-city/operating-city.service';

import ormconfig from 'ormconfig';

import {
  Business,
  BusinessOperationWindow,
  BusinessReview,
  OperatingCity,
  WorkType,
  BusinessController,
  BusinessReviewController,
  BusinessOperationWindowController,
  BusinessService,
  BusinessReviewService,
  BusinessOperationWindowService,
} from './features';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: ormconfig.type,
      database: ormconfig.database,
      entities: [
        Business,
        BusinessOperationWindow,
        BusinessReview,
        OperatingCity,
        WorkType,
      ],
      synchronize: false,
      logging: ['error', 'query'],
    }),
    TypeOrmModule.forFeature([Business]),
  ],
  controllers: [
    BusinessController,
    WorkTypeController,
    OperatingCityController,
    BusinessReviewController,
    BusinessOperationWindowController,
  ],
  providers: [
    BusinessService,
    WorkTypeService,
    OperatingCityService,
    BusinessReviewService,
    BusinessOperationWindowService,
  ],
})
export class AppModule {}
