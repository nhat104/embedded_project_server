import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";

export class GetRequestsDto {
    @ApiProperty({ required: true })
    @IsOptional()
    @IsInt()
    pageSize: number;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsInt()
    pageNumber: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(['Pending', 'Accepted', 'Rejected', 'Expired'])
    status: string;
}