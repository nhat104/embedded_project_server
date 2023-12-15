import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class GetNotificationsDto {
    @ApiProperty({ required: true })
    @IsOptional()
    @IsInt()
    pageSize: number;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsInt()
    pageNumber: number;

    @ApiProperty({ required: false })
    status: boolean;
}