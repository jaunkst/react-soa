import { define } from 'typeorm-seeding';
import Faker from 'faker';
import { BusinessReview } from '../../app';

define(BusinessReview, (faker: typeof Faker) => {
  const businessReview = new BusinessReview({
    ratingScore: faker.random.number({ min: 1, max: 5 }),
    customerComment: faker.lorem.paragraph(
      faker.random.number({ min: 1, max: 3 })
    ),
  });
  return businessReview;
});
