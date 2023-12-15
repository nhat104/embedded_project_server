import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddMemberDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    phone: string;
}