import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { OperatingCity } from '../../app';

export default class CreateOperatingCities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(OperatingCity)().createMany(100);
  }
}
