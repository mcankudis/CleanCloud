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
import { DatacenterSaveFindResponse } from './DatacenterSave';
import {
    DatacenterSaveCreateRequestDTO,
    DatacenterSaveUpdateRequestDTO,
} from './DatacenterSave.dto';
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
    async createDatacenterSave(
        @Body() save: DatacenterSaveCreateRequestDTO
    ): Promise<DatacenterSaveFindResponse> {
        const createdSave = await this.datacenterSaveService.createDatacenterSave(save);

        return {
            id: createdSave.id,
            positions: createdSave.positions,
        };
    }

    @Patch()
    async updateDatacenterSave(
        @Body() update: DatacenterSaveUpdateRequestDTO
    ): Promise<DatacenterSaveFindResponse> {
        const updatedSave = await this.datacenterSaveService.updateDatacenterSave(update);

        if (!updatedSave) throw new HttpException('Cannot find save', HttpStatus.NOT_FOUND);

        return {
            id: updatedSave.id,
            positions: updatedSave.positions,
        };
    }
}
