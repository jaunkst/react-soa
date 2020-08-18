import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { BusinessReviewService } from './business-review.service';
import {
  CreateBusinessReviewDto,
  UpdateBusinessReviewDto,
} from './business-review.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IdParamDto } from '@libs/backend/utils';

@ApiTags('Reviews')
@Controller()
export class BusinessReviewController {
  constructor(private readonly businessReviewService: BusinessReviewService) {}

  @Get('/api/reviews')
  @ApiOperation({ summary: 'List all reviews' })
  public getBusinessReviews() {
    return this.businessReviewService.all();
  }

  @ApiOperation({ summary: 'List all reviews for a business' })
  @Get('/api/business/:id/reviews')
  public async getReviewsForBusiness(@Param() { id }: IdParamDto) {
    return await this.businessReviewService.findByBusinessId(id);
  }

  @ApiOperation({ summary: 'Create a new review for a business' })
  @Post('/api/business/:id/reviews')
  public async createReviewForBusiness(
    @Param() { id }: IdParamDto,
    @Body() createBusinessOperationWindowDto: CreateBusinessReviewDto
  ) {
    return await this.businessReviewService.create({
      businessId: id,
      ...createBusinessOperationWindowDto,
    });
  }

  @ApiOperation({ summary: 'Update an existing review for a business' })
  @Put('/api/business/:businessId/reviews/:id')
  public async updateReviewForBusiness(
    @Param() { id }: IdParamDto,
    @Body() updateBusinessOperationWindowDto: UpdateBusinessReviewDto
  ) {
    return await this.businessReviewService.update(
      id,
      updateBusinessOperationWindowDto
    );
  }

  @ApiOperation({ summary: 'Delete an existing review for a business' })
  @Delete('/api/business/:businessId/reviews/:id')
  public async deleteReviewForBusiness(@Param() { id }: IdParamDto) {
    return await this.businessReviewService.delete(id);
  }
}
