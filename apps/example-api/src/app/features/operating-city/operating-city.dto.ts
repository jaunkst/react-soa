import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOperatingCityDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class AssignOperatingCityDto {
  @ApiProperty()
  @IsInt()
  businessId: number;

  @ApiProperty()
  @IsInt()
  operatingCityId: number;
}

export class UnassignOperatingCityDto {
  @ApiProperty()
  @IsInt()
  businessId: number;

  @ApiProperty()
  @IsInt()
  operatingCityId: number;
}

export class UpdateOperatingCityDto {
  @ApiProperty()
  @IsString()
  name: string;
}
