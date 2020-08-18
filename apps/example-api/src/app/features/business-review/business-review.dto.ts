import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessReviewDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Transform(parseInt)
  businessId?: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(5)
  ratingScore: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerComment?: string;
}

export class UpdateBusinessReviewDto {
  @IsInt()
  @IsOptional()
  @Transform(parseInt)
  id?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(5)
  ratingScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerComment?: string;
}

export class QueryBusinessReviewDto {
  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  eq?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lt?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  gte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  lte?: number;

  @ApiProperty({ required: false })
  @Min(0)
  @Max(5)
  @IsOptional()
  @IsInt()
  @Transform(parseInt)
  not?: number;
}
