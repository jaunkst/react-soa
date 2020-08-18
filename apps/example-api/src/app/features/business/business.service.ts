import { Injectable, NotFoundException } from '@nestjs/common';
import {
  forEach,
  hasPath,
  keys,
  last,
  merge,
  path,
  toUpper,
  when,
} from 'ramda';
import {
  FindManyOptions,
  FindOneOptions,
  getRepository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { IPagingatedResults, VALID_QUERY_OPERATORS } from '@libs/backend/utils';
import {
  CreateBusinessDto,
  QueryBusinessDto,
  UpdateBusinessDto,
} from './business.dto';
import { Business } from './business.entity';

interface IQueryBuilderFragment {
  path: string[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  builder: Function;
}

@Injectable()
export class BusinessService {
  public async all(options?: FindManyOptions) {
    return await getRepository(Business).find(options);
  }

  public async query(
    queryBusinessDto: QueryBusinessDto
  ): Promise<IPagingatedResults<Business>> {
    const queryBuilder = getRepository(Business).createQueryBuilder('business');
    // Each fragment may add onto our query based on what the paramerters are that we recieved
    // from the client while avoiding unessary existance, and depth checks.
    const queryFragments: IQueryBuilderFragment[] = [
      {
        path: ['name'],
        builder: () => {
          queryBuilder.andWhere("business.name like '%' || :name || '%'", {
            name: queryBusinessDto.name,
          });
        },
      },
      {
        path: ['avgRatingScore'],
        builder: () => {
          this.buildOperatorFragment(queryBuilder, queryBusinessDto, [
            'avgRatingScore',
          ]);
        },
      },
      {
        path: ['businessHours'],
        builder: () => {
          queryBuilder.innerJoin('business.businessHours', 'businessHours');
        },
      },
      {
        path: ['businessHours', 'dayOfWeek'],
        builder: () => {
          queryBuilder.andWhere(`businessHours.dayOfWeek IN (:...dayOfWeek)`, {
            dayOfWeek: queryBusinessDto.businessHours.dayOfWeek,
          });
        },
      },
      {
        path: ['businessHours', 'open'],
        builder: () => {
          this.buildOperatorFragment(queryBuilder, queryBusinessDto, [
            'businessHours',
            'open',
          ]);
        },
      },
      {
        path: ['businessHours', 'close'],
        builder: () => {
          this.buildOperatorFragment(queryBuilder, queryBusinessDto, [
            'businessHours',
            'close',
          ]);
        },
      },
      {
        path: ['workTypes'],
        builder: () => {
          queryBuilder.innerJoin('business.workTypes', 'workTypes');
          queryBuilder.andWhere('workTypes.id IN (:...workTypes)', {
            workTypes: queryBusinessDto.workTypes,
          });
        },
      },
      {
        path: ['operatingCities'],
        builder: () => {
          queryBuilder.innerJoin('business.operatingCities', 'operatingCities');
          queryBuilder.andWhere('operatingCities.id IN (:...operatingCities)', {
            operatingCities: queryBusinessDto.operatingCities,
          });
        },
      },
    ];

    // iterate and test our fragment defintions above and execute the builder funciton
    // if the path condition returns true.
    forEach(({ path, builder }) => {
      when(hasPath(path), builder)(queryBusinessDto);
    })(queryFragments);

    const businessIds = await queryBuilder.select('business.id').getMany();
    const { skip, limit } = queryBusinessDto;

    // fetch the busineses, relations, paginate and return.
    return await getRepository(Business)
      .findByIds(businessIds, {
        order: {
          [queryBusinessDto.sortBy]: queryBusinessDto.orderBy,
        },
        skip: skip,
        take: limit,
        relations: ['businessHours', 'reviews', 'operatingCities', 'workTypes'],
      })
      .then((results) => {
        return {
          results,
          skip,
          limit,
          count: results.length,
        };
      });
  }

  public async findOne(id: number, options?: FindOneOptions) {
    return await getRepository(Business).findOne(id, options);
  }

  public async create(
    createBusinessDto: CreateBusinessDto,
    options?: SaveOptions
  ) {
    return await getRepository(Business).save(
      new Business(createBusinessDto),
      options
    );
  }

  public async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    const business = await getRepository(Business).findOne(id);
    if (!business) throw new NotFoundException();

    return await getRepository(Business).save(
      merge(business, updateBusinessDto)
    );
  }

  public async delete(id: number) {
    return await getRepository(Business).delete(id);
  }

  // Utility function to build a where statement that is confined to valid query operators.
  // The DTO has already qualified the query params.
  private buildOperatorFragment(
    queryBuilder: SelectQueryBuilder<Business>,
    query: QueryBusinessDto,
    propertyPath: string[]
  ) {
    const propertyValue = path(propertyPath, query);
    const queryOperatorKeys = keys(propertyValue);
    const propertyKey = last(propertyPath);

    for (const operatorKey of queryOperatorKeys) {
      const operatorEnumKey = toUpper(operatorKey);
      const queryOperatorValue = propertyValue[operatorKey];
      const queryOperator = VALID_QUERY_OPERATORS[operatorEnumKey];
      const uniqOperatorKey = `${propertyKey}_${operatorKey}`;
      queryBuilder.andWhere(
        `${propertyPath.join('.')} ${queryOperator} :${uniqOperatorKey}`,
        { [uniqOperatorKey]: queryOperatorValue }
      );
    }
  }
}
