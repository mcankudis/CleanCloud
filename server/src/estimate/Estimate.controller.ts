import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';

import { EstimateService } from './Estimate.service';
import { Estimate } from './types/Estimate';

@Controller('/estimate')
export class EstimateController {
    constructor(private readonly latLngService: EstimateService) {}

    @Get()
    async getEstimate(
        @Query('lat', ParseIntPipe) latitude: number,
        @Query('lng', ParseIntPipe) longitude: number
    ): Promise<Estimate> {
        return this.latLngService.getEstimate(latitude, longitude);
    }
}
