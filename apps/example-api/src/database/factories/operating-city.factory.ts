import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { OperatingCity } from '../../app';

define(OperatingCity, (faker: typeof Faker) => {
  const operatingCity = new OperatingCity({ name: faker.address.city() });
  return operatingCity;
});
