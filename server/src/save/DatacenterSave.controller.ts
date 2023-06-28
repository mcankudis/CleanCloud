import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import {
    DatacenterSaveCreateRequest,
    DatacenterSaveFindResponse,
    DatacenterSaveUpdateRequest,
} from './DatacenterSave';
import { DatacenterSaveService } from './DatacenterSave.service';

@Controller('/save')
export class DatacenterSaveController {
    constructor(private readonly datacenterSaveService: DatacenterSaveService) {}

    @Get(':id')
    async getSave(@Param('id') id: string): Promise<DatacenterSaveFindResponse> {
        const datacenter = await this.datacenterSaveService.getDatacenterSaveById(id);
        if (!datacenter) throw new HttpException('Cannot find save', HttpStatus.NOT_FOUND);
        return {
            id,
            positions: datacenter?.positions,
        };
    }

    @Post()
    // todo validation
    async createDatacenterSave(
        @Body() save: DatacenterSaveCreateRequest
    ): Promise<DatacenterSaveFindResponse> {
        const createdSave = await this.datacenterSaveService.createDatacenterSave(save);

        return {
            id: createdSave.id,
            positions: createdSave.positions,
        };
    }

    @Patch()
    // todo validation
    async updateDatacenterSave(
        @Body() update: DatacenterSaveUpdateRequest
    ): Promise<DatacenterSaveFindResponse> {
        const updatedSave = await this.datacenterSaveService.updateDatacenterSave(update);

        if (!updatedSave) throw new HttpException('Cannot find save', HttpStatus.NOT_FOUND);

        return {
            id: updatedSave.id,
            positions: updatedSave.positions,
        };
    }
}
