import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RemoveMemberDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string;
}