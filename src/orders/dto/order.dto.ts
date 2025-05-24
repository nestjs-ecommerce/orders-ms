import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { OrderStatus } from "generated/prisma";

export class OrderDto {
    @IsUUID()
    id: string;

    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    totalAmount: number;

    @Type(() => Number) 
    @IsPositive()
    @IsNumber()
    totalItems: number;

    @IsBoolean()
    @IsOptional()
    isPaid: boolean;

    @IsDate()
    @IsOptional()
    paidAt: Date | null;

    @IsEnum(OrderStatus)
    status: OrderStatus;
    
    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;

    constructor(partial: Partial<OrderDto>) {
        Object.assign(this, partial);
    }
}