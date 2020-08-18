import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { WorkType } from '../../app';

define(WorkType, (faker: typeof Faker, context: any) => {
  const workType = new WorkType({ name: context.name });
  return workType;
});
