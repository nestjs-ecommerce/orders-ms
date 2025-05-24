import { PaginationOptionsDto } from "src/common/dto/pagination/pagination-options.dto";

export interface PaginationMetadataDtoParameters {
    paginationOptionsDto: PaginationOptionsDto |  Partial<PaginationOptionsDto>;
    itemCount: number;  
}