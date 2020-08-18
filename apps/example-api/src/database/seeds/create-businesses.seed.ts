import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Business } from '../../app/features/business/business.entity';
import { BusinessOperationWindow } from '../../app/features/business-operation-window/business-operation-window.entity';
import { BusinessReview } from '../../app/features/business-review/business-review.entity';
import { OperatingCity } from '../../app/features/operating-city/operating-city.entity';
import { WorkType } from '../../app/features/work-type/work-type.entity';
import * as faker from 'faker';
import { head } from 'ramda';

const workTypeNames = [
  'Accountant',
  'Actor',
  'Architect',
  'Artist',
  'Auctioneer',
  'Author',
  'Barber',
  'Bookkeeper',
  'Boxer',
  'Caddie',
  'Consultant',
  'Courier',
  'Dry Cleaner',
  'Engineer',
  'Entertainer',
  'Fashion Model',
  'Freelance Photographer',
  'Gardener',
  'General Contractor',
  'General Practitioner',
  'Hairdresser',
  'IT professional',
  'Interpreter',
  'Juror',
  'Lawn Care',
  'Lawyer',
  'Lifeguard',
  'Mason',
  'Massage Therapist',
  'Medical Doctor',
  'Nurse',
  'Newspaper Carrier',
  'Paid Speaker',
  'Personal Trainer',
  'PGA Golfer',
  'Swimming Pool Service Technician',
  'Private Investigator',
  'Radio Presenter',
  'Security Guard',
  'Office Clerk',
  'Professional Wrestler',
  'Professional Athlete',
  'Real Estate Agent',
  'Sales Representative',
  'Snow Removal',
  'Sports Official',
  'Stockbroker',
  'Talent Agent',
  'Taxi Driver',
  'Technical Writer',
  'Truck Driver',
];

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const schedules = [
  [0, 6],
  [0, 1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5],
  [0, 2, 3, 4, 5],
  [1, 2, 4, 5],
];

export default class CreateBusinesses implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let workTypes = [];
    for (const workTypeName of workTypeNames) {
      const workType = await factory(WorkType)({ name: workTypeName }).create();
      workTypes.push(workType);
    }

    const businessess = await factory(Business)().createMany(400);
    const operatingCities = await factory(OperatingCity)().createMany(40);
    for (const business of businessess) {
      business.operatingCities = getRandom(operatingCities, 4);
      business.workTypes = getRandom(workTypes, 2);
      business.businessHours = [];

      const daysOfWeek = head(getRandom(schedules, 1));

      for (const dayOfWeek of daysOfWeek) {
        const businessOperationWindow = await factory(BusinessOperationWindow)({
          dayOfWeek,
        }).create();
        business.businessHours.push(businessOperationWindow);
      }

      const numReviews = faker.random.number(10);
      business.reviews = await factory(BusinessReview)().createMany(numReviews);

      const reviewSum = business.reviews.reduce((sum, review) => {
        sum += review.ratingScore;
        return sum;
      }, 0);

      business.avgRatingScore = Math.round(reviewSum / business.reviews.length);

      await connection.manager.save(business);
    }
  }
}
