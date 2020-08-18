import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { WorkTypeService } from './work-type.service';
import { CreateWorkTypeDto, AssignWorkTypeDto } from './work-type.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IdParamDto } from '@libs/backend/utils';

@ApiTags('Job (WorkTypes)')
@Controller()
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @ApiOperation({ summary: 'List all available work types' })
  @Get('/api/workTypes')
  public getWorkTypes() {
    return this.workTypeService.all();
  }

  @ApiOperation({ summary: 'Create a new work type' })
  @Post('/api/workTypes')
  public createWorkType(@Body() createWorkTypeDto: CreateWorkTypeDto) {
    return this.workTypeService.create(createWorkTypeDto);
  }

  @ApiOperation({ summary: 'Update an existing work type' })
  @Put('/api/workTypes/:id')
  public updateWorkType(
    @Param() { id }: IdParamDto,
    @Body() createWorkTypeDto: CreateWorkTypeDto
  ) {
    return this.workTypeService.update(id, createWorkTypeDto);
  }

  @ApiOperation({ summary: 'Delete an existing work type' })
  @Delete('/api/workTypes/:id')
  public deleteWorkType(@Param() { id }: IdParamDto) {
    return this.workTypeService.delete(id).then(() => {
      return '';
    });
  }

  @ApiOperation({ summary: 'Assign an existing work type to a business' })
  @Post('/api/businessWorkTypes')
  public async assignWorkTypeToBusiness(
    @Body() assignWorkTypeDto: AssignWorkTypeDto
  ) {
    return await this.workTypeService.assignBusiness(assignWorkTypeDto);
  }
  @ApiOperation({ summary: 'Unsassign an existing work type to a business' })
  @Delete('/api/businessWorkTypes')
  public async unassignedWorkTypeToBusiness(
    @Body() assignWorkTypeDto: AssignWorkTypeDto
  ) {
    return await this.workTypeService.unassignBusiness(assignWorkTypeDto);
  }

  @ApiOperation({ summary: 'List all work type assigned to a business' })
  @Get('/api/business/:id/workTypes')
  public async getWorkTypesForBusiness(@Param() { id }: IdParamDto) {
    return await this.workTypeService.findByBusinessId(id);
  }
}
