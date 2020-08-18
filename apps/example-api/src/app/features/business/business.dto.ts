import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { map, toUpper, values } from 'ramda';
import { ORDER_BY } from '@libs/backend/utils';
import { QueryBusinessOperationWindowDto } from '../business-operation-window/business-operation-window.dto';
import { QueryBusinessReviewDto } from '../business-review/business-review.dto';

export enum VALID_BUSINESS_QUERY_SORT_BY {
  NAME = 'name',
  AVG_RATING_SCORE = 'avgRatingScore',
}

export enum VALID_BUSINESS_QUERY_RELATION {
  BUSINESS_HOURS = 'businessHours',
  REVIEWS = 'reviews',
  OPERATING_CITIES = 'operatingCities',
  WORK_TYPES = 'workTypes',
}

export class CreateBusinessDto {
  @ApiProperty()
  @IsString()
  addressLine1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  stateAbbr: string;

  @ApiProperty()
  @IsString()
  postal: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateBusinessDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  stateAbbr?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

export class QueryBusinessDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => QueryBusinessOperationWindowDto)
  businessHours?: QueryBusinessOperationWindowDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => QueryBusinessReviewDto)
  avgRatingScore?: QueryBusinessReviewDto;

  @ApiProperty({ type: 'integer', isArray: true, required: false })
  @IsOptional()
  @IsInt({ each: true })
  @Transform(map(parseInt))
  workTypes?: number[];

  @ApiProperty({ type: 'integer', isArray: true, required: false })
  @IsOptional()
  @IsInt({ each: true })
  @Transform(map(parseInt))
  operatingCities?: number[];

  // Sorting
  @ApiProperty({ type: 'string', default: 'name', required: false })
  @IsOptional()
  @IsEnum(VALID_BUSINESS_QUERY_SORT_BY, {
    message: `sortBy must be one of the following: ${values(
      VALID_BUSINESS_QUERY_SORT_BY
    ).join(', ')}`,
  })
  sortBy?: VALID_BUSINESS_QUERY_SORT_BY;

  @ApiProperty({ type: 'string', default: 'ASC', required: false })
  @IsOptional()
  @IsEnum(ORDER_BY)
  @Transform(toUpper)
  orderBy?: ORDER_BY;

  // Pagination
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(parseInt)
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Max(100)
  @Transform(parseInt)
  limit?: number;
}
