import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DatacenterSaveCreateRequest, DatacenterSaveUpdateRequest } from './DatacenterSave';

export class DatacenterSavePositionDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsNumber()
    projectedEnergyConsumptionInKWh?: number;
}

export class DatacenterSaveCreateRequestDTO implements DatacenterSaveCreateRequest {
    @ValidateNested({ each: true })
    @Type(() => DatacenterSavePositionDTO)
    positions: DatacenterSavePositionDTO[];
}

export class DatacenterSaveUpdateRequestDTO implements DatacenterSaveUpdateRequest {
    @IsString()
    id: string;

    @ValidateNested({ each: true })
    @Type(() => DatacenterSavePositionDTO)
    positions: DatacenterSavePositionDTO[];
}
