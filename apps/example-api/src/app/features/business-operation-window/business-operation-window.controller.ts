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
import { IdParamDto } from '@libs/backend/utils';
import {
  CreateBusinessOperationWindowDto,
  UpdateBusinessOperationWindowDto,
} from './business-operation-window.dto';
import { BusinessOperationWindowService } from './business-operation-window.service';

@ApiTags('Operation Hours')
@Controller()
export class BusinessOperationWindowController {
  constructor(
    private readonly businessOperationWindowService: BusinessOperationWindowService
  ) {}

  @ApiOperation({ summary: 'List all business hours' })
  @Get('/api/businessHours')
  public getHours() {
    return this.businessOperationWindowService.all();
  }

  @ApiOperation({ summary: 'List all business hours for a business' })
  @Get('/api/business/:id/hours')
  public async getHoursForBusiness(@Param() { id }: IdParamDto) {
    return await this.businessOperationWindowService.findByBusinessId(id);
  }

  @ApiOperation({ summary: 'Create business hours for a business' })
  @Post('/api/business/:businessId/hours')
  public async createHoursForBusiness(
    @Param() { id }: IdParamDto,
    @Body() createBusinessOperationWindowDto: CreateBusinessOperationWindowDto
  ) {
    return await this.businessOperationWindowService.create({
      businessId: id,
      ...createBusinessOperationWindowDto,
    });
  }

  @ApiOperation({ summary: 'Update business hours for a business' })
  @Put('/api/business/:businessId/hours/:id')
  public async updateHoursForBusiness(
    @Param() { id }: IdParamDto,
    @Body() updateBusinessOperationWindowDto: UpdateBusinessOperationWindowDto
  ) {
    return await this.businessOperationWindowService.update(
      id,
      updateBusinessOperationWindowDto
    );
  }

  @ApiOperation({ summary: 'Delete business hours for a business' })
  @Delete('/api/business/:businessId/hours/:id')
  public async deleteHoursForBusiness(@Param() { id }: IdParamDto) {
    return await this.businessOperationWindowService.delete(id);
  }
}
