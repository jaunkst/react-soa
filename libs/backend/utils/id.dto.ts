import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// This is a generate pramater DTO that I am using for many of the controller methods
// I didn't need to redifine one for each controller so for the sake of reuse this exists here.
export class IdParamDto {
  @ApiProperty({ required: true })
  @Transform(parseInt)
  id: number;
}
