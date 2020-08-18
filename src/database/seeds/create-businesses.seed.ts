import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Business } from '../../features/business';
import * as seedData from './seed-data.json';
import { BusinessOperationWindow } from '../../features/business-operation-window';
import { BusinessReview } from '../../features/business-review';
import { OperatingCity } from '../../features/operating-city/operating-city.entity';
import { WorkType } from '../../features/work-type/work-type.entity';

export default class CreateBusinesses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const operatingCitiesMap = new Map();
    const workTypesMap = new Map();

    for (const _business of seedData) {
      const operatingCities = [];
      const workTypes = [];
      for (const operatingCityName of _business.operatingCities) {
        if (!operatingCitiesMap.has(operatingCityName)) {
          operatingCitiesMap.set(
            operatingCityName,
            new OperatingCity({ name: operatingCityName }),
          );
        }
        const operatingCity = operatingCitiesMap.get(operatingCityName);
        await connection.manager.save(operatingCity);
        operatingCities.push(operatingCity);
      }

      for (const workTypeName of _business.workTypes) {
        if (!workTypesMap.has(workTypeName)) {
          workTypesMap.set(workTypeName, new WorkType({ name: workTypeName }));
        }
        const workType = workTypesMap.get(workTypeName);
        await connection.manager.save(workType);
        workTypes.push(workType);
      }

      const business = new Business(_business);
      business.operatingCities = operatingCities;
      business.workTypes = workTypes;

      await connection.manager.save(business);

      for (const _businessOperationWindow of _business.businessHours) {
        const businessOperationWindow = new BusinessOperationWindow(
          _businessOperationWindow,
        );
        businessOperationWindow.business = business;
        await connection.manager.save(businessOperationWindow);
      }

      for (const _businessReview of _business.reviews) {
        const businessReview = new BusinessReview(_businessReview);
        businessReview.business = business;
        await connection.manager.save(businessReview);
      }
    }
  }
}
