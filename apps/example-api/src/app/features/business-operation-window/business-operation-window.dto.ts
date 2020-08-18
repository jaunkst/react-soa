import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { IsValidOperators, VALID_QUERY_OPERATORS } from '@libs/backend/utils';
import { DAY_OF_WEEK } from '@libs/isomorphic/models';
import { isArray, isNumber } from 'util';

export class CreateBusinessOperationWindowDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Transform(parseInt)
  businessId?: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: DAY_OF_WEEK;

  @ApiProperty()
  @IsInt()
  open: number;

  @ApiProperty()
  @IsInt()
  close: number;
}

export class UpdateBusinessOperationWindowDto {
  @IsInt()
  @IsOptional()
  @Transform(parseInt)
  id?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Transform(parseInt)
  businessId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: DAY_OF_WEEK;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  open?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  close?: number;
}

export class QueryOperatorsDayOfWeekDto {
  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  eq?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(6)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  not?: number;
}

export class QueryOperatorsHourDto {
  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  eq?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(24)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  not?: number;
}

export class QueryBusinessOperationWindowDto {
  @ApiProperty({ required: false, type: 'number', isArray: true })
  @IsOptional()
  @IsEnum(DAY_OF_WEEK, { each: true })
  dayOfWeek?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsValidOperators(VALID_QUERY_OPERATORS)
  @ValidateNested()
  @Type(() => QueryOperatorsHourDto)
  open?: QueryOperatorsHourDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsValidOperators(VALID_QUERY_OPERATORS)
  @ValidateNested()
  @Type(() => QueryOperatorsHourDto)
  close?: QueryOperatorsHourDto;
}
