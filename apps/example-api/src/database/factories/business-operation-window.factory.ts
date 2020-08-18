import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { BusinessOperationWindow } from '../../app';

define(BusinessOperationWindow, (faker: typeof Faker, context: any) => {
  const businessOperationWindow = new BusinessOperationWindow({
    dayOfWeek: context.dayOfWeek,
    open: faker.random.number({
      min: 5,
      max: 11,
    }),
    close: faker.random.number({
      min: 16,
      max: 24,
    }),
  });
  return businessOperationWindow;
});
