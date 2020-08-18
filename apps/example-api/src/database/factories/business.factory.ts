import { define, factory } from 'typeorm-seeding';
import Faker from 'faker';
import { Business, OperatingCity } from '../../app';

define(Business, (faker: typeof Faker) => {
  const business = new Business({
    name: faker.company.companyName(),
    addressLine1: faker.address.streetAddress(),
    addressLine2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    postal: faker.address.zipCode(),
    stateAbbr: faker.address.stateAbbr(),
  });
  return business;
});
