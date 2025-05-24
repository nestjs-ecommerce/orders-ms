import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { PaginationMetadataDto } from "./pagination-metadata.dto";

export class PaginationDto<T> {
    @IsArray()
    readonly data: T[];

    @Type(() => PaginationMetadataDto)
    readonly meta: PaginationMetadataDto;

    constructor(data: T[], meta: PaginationMetadataDto) {
        this.data = data;
        this.meta = meta;
    }
}