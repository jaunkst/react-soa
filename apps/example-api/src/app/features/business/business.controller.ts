import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { merge } from 'ramda';
import { IdParamDto, ORDER_BY } from '@libs/backend/utils';
import {
  CreateBusinessDto,
  QueryBusinessDto,
  UpdateBusinessDto,
  VALID_BUSINESS_QUERY_SORT_BY,
} from './business.dto';
import { BusinessService } from './business.service';

export const DEFAULT_QUERY_OPTIONS = {
  sortBy: VALID_BUSINESS_QUERY_SORT_BY.NAME,
  orderBy: ORDER_BY.ASC,
  relations: [],
  skip: 0,
  limit: 10,
};

// Swagger Tag
@ApiTags('Businesses')
@Controller()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({ summary: 'Query all businesses' })
  @Post('/api/search')
  public async searchBusinesess(@Body() queryBusinessDto: QueryBusinessDto) {
    return await this.businessService.query(
      merge(DEFAULT_QUERY_OPTIONS, queryBusinessDto)
    );
  }

  @ApiOperation({ summary: 'List all businesses' })
  @Get('/api/businesses')
  public async getBusinesses() {
    return await this.businessService.all();
  }

  @ApiOperation({ summary: 'Create a new business' })
  @Post('/api/businesses')
  public async createBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    return await this.businessService.create(createBusinessDto);
  }

  @ApiOperation({ summary: 'Get an existing business' })
  @Get('/api/businesses/:id')
  public async getBusiness(@Param() { id }: IdParamDto) {
    return await this.businessService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing business' })
  @Put('/api/businesses/:id')
  public async updateBusiness(
    @Param() { id }: IdParamDto,
    @Body() updateBusinessDto: UpdateBusinessDto
  ) {
    return await this.businessService.update(id, updateBusinessDto);
  }

  @ApiOperation({ summary: 'Delete an existing business' })
  @Delete('/api/businesses/:id')
  public async deleteBusiness(@Param() { id }: IdParamDto) {
    return await this.businessService.delete(id);
  }
}
