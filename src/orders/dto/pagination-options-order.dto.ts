import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "generated/prisma";
import { PaginationOptionsDto } from "src/common/dto/pagination/pagination-options.dto";

export class PaginationOrderOptionsDto extends PartialType(PaginationOptionsDto) {
    @IsOptional()
    @IsEnum(OrderStatus)    
    readonly status?: OrderStatus = OrderStatus.PENDING;
}