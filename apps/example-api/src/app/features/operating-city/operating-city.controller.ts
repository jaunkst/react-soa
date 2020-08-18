import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { OperatingCityService } from './operating-city.service';

import {
  AssignOperatingCityDto,
  CreateOperatingCityDto,
} from './operating-city.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IdParamDto } from '@libs/backend/utils';

@ApiTags('Operating Cities')
@Controller()
export class OperatingCityController {
  constructor(private readonly operatingCityService: OperatingCityService) {}

  @Get('/api/operatingCities')
  @ApiOperation({ summary: 'List all available operating cities' })
  public getOperatingCities() {
    return this.operatingCityService.all();
  }

  @ApiOperation({ summary: 'Create a new operating city' })
  @Post('/api/operatingCities')
  public createOperatingCity(
    @Body() createOperatingCityDto: CreateOperatingCityDto
  ) {
    return this.operatingCityService.create(createOperatingCityDto);
  }

  @ApiOperation({ summary: 'Update an exisiting operating city' })
  @Put('/api/operatingCities/:id')
  public updateOperatingCity(
    @Param() { id }: IdParamDto,
    @Body() createOperatingCityDto: CreateOperatingCityDto
  ) {
    return this.operatingCityService.update(id, createOperatingCityDto);
  }

  @ApiOperation({ summary: 'Delete an exisiting operating city' })
  @Delete('/api/operatingCities/:id')
  public deleteOperatingCity(@Param() { id }: IdParamDto) {
    return this.operatingCityService.delete(id).then(() => {
      return '';
    });
  }

  @ApiOperation({ summary: 'Assign an exisiting operating city to a business' })
  @Post('/api/businessOperatingCities')
  public async assignOperatingCityToBusiness(
    @Body() assignOperatingCityDto: AssignOperatingCityDto
  ) {
    return await this.operatingCityService.assignBusiness(
      assignOperatingCityDto
    );
  }

  @ApiOperation({
    summary: 'Unassign an exisiting operating city to a business',
  })
  @Delete('/api/businessOperatingCities')
  public async unassignedOperatingCityToBusiness(
    @Body() assignOperatingCityDto: AssignOperatingCityDto
  ) {
    return await this.operatingCityService.unassignBusiness(
      assignOperatingCityDto
    );
  }

  @Get('/api/business/:id/operatingCities')
  @ApiOperation({
    summary: 'List all operating cities assigned to a business',
  })
  public async getOperatingCitiesForBusiness(@Param() { id }: IdParamDto) {
    return await this.operatingCityService.findByBusinessId(id);
  }
}
