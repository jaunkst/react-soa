import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class AssignWorkTypeDto {
  @ApiProperty()
  @IsInt()
  businessId: number;

  @ApiProperty()
  @IsInt()
  workTypeId: number;
}

export class UnassignWorkTypeDto {
  @ApiProperty()
  @IsInt()
  businessId: number;

  @ApiProperty()
  @IsInt()
  workTypeId: number;
}

export class UpdateWorkTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}
